import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_COOKIE_OPTIONS,
} from "../utils/tokens.js";

const register = AsyncHandler(async (req, res) => {
  const { full_name, email, phone, cnic, password, pin } = req.body;

  const requiredFields = { full_name, email, phone, cnic, password, pin };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, v]) => !v || String(v).trim() === "")
    .map(([k]) => k);

  if (missingFields.length) {
    throw new ApiError(422, "Request validation failed.", {
      code: "VALIDATION_ERROR",
      fields: Object.fromEntries(
        missingFields.map((f) => [f, `${f} is required.`]),
      ),
    });
  }

  
  const validationErrors = {};

  if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic))
    validationErrors.cnic = "Invalid CNIC format. Expected: XXXXX-XXXXXXX-X";

  if (!/^03\d{9}$/.test(phone))
    validationErrors.phone = "Invalid phone format. Expected: 03XXXXXXXXX";

  if (!/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password))
    validationErrors.password =
      "Password must be at least 8 characters and contain at least one special character.";

  if (!/^\d{4,6}$/.test(pin))
    validationErrors.pin = "PIN must be 4 to 6 digits.";

  if (Object.keys(validationErrors).length) {
    throw new ApiError(422, "Request validation failed.", {
      code: "VALIDATION_ERROR",
      fields: validationErrors,
    });
  }

  
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }, { cnic }],
    },
  });

  if (existingUser) {
    const duplicateField =
      existingUser.email === email
        ? "email"
        : existingUser.phone === phone
          ? "phone"
          : "cnic";

    throw new ApiError(
      409,
      `An account with this ${duplicateField} already exists.`,
      {
        code: "DUPLICATE_ENTRY",
        field: duplicateField,
      },
    );
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPin = await bcrypt.hash(pin, 10);

 
  const { user, wallet } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        full_name,
        email,
        phone,
        cnic,
        password_hash: hashedPassword, 
        pin_hash: hashedPin, 
        role: "user",
        is_verified: false,
      },
    });

    const wallet = await tx.wallet.create({
      data: {
        user_id: user.id,
        balance: "0.00",
        currency: "PKR",
      },
    });

    return { user, wallet };
  });

 
  const accessToken = generateAccessToken(user);

  
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        access_token: accessToken,
        expires_in: 900,
        token_type: "Bearer",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_verified: user.is_verified,
          created_at: user.created_at,
        },
        wallet: {
          id: wallet.id,
          balance: wallet.balance,
          currency: wallet.currency,
        },
      },
      "Account created. Please verify your phone.",
    ),
  );
});


const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    throw new ApiError(422, "Email and password are required.", {
      code: "VALIDATION_ERROR",
      fields: {
        ...(!email && { email: "Email is required." }),
        ...(!password && { password: "Password is required." }),
      },
    });
  }

  
  const user = await prisma.user.findUnique({ where: { email } });

  
  if (!user) {
    throw new ApiError(401, "Invalid email or password.", {
      code: "INVALID_CREDENTIALS",
    });
  }


  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.", {
      code: "INVALID_CREDENTIALS",
    });
  }

  
  if (!user.is_verified) {
    throw new ApiError(
      403,
      "Please verify your phone number before logging in.",
      {
        code: "PHONE_NOT_VERIFIED",
      },
    );
  }

  if (user.is_frozen) {
    throw new ApiError(403, "Your account has been frozen. Contact support.", {
      code: "ACCOUNT_FROZEN",
    });
  }

  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      user_id: user.id,
      token_hash: tokenHash,
      device_info: req.headers["user-agent"] || null,
      ip_address: req.ip || null,
      expires_at: expiresAt,
    },
  });

  
  await prisma.user.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  });

  
  res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);

  
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        access_token: accessToken,
        expires_in: 900,
        token_type: "Bearer",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_verified: user.is_verified,
          is_email_verified: user.is_email_verified,
          last_login: user.last_login,
        },
      },
      "Logged in successfully.",
    ),
  );
});


const refresh = AsyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refresh_token;

  if (!incomingToken) {
    throw new ApiError(401, "Refresh token missing.", { code: "UNAUTHORIZED" });
  }

 
  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Refresh token invalid or expired.", {
      code: "UNAUTHORIZED",
    });
  }

  
  const tokenHash = hashToken(incomingToken);
  const session = await prisma.session.findFirst({
    where: {
      token_hash: tokenHash,
      is_revoked: false,
      expires_at: { gt: new Date() },
    },
  });

  if (!session) {
    throw new ApiError(401, "Session expired or revoked. Please login again.", {
      code: "SESSION_INVALID",
    });
  }


  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new ApiError(401, "User not found.", { code: "UNAUTHORIZED" });
  }

  if (user.is_frozen) {
    throw new ApiError(403, "Your account has been frozen. Contact support.", {
      code: "ACCOUNT_FROZEN",
    });
  }

  
  const newRefreshToken = generateRefreshToken(user);
  const newTokenHash = hashToken(newRefreshToken);
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    // Revoke old session
    prisma.session.update({
      where: { id: session.id },
      data: { is_revoked: true },
    }),
    // Create new session
    prisma.session.create({
      data: {
        user_id: user.id,
        token_hash: newTokenHash,
        device_info: session.device_info,
        ip_address: req.ip || null,
        expires_at: newExpiresAt,
      },
    }),
  ]);


  const accessToken = generateAccessToken(user);
  res.cookie("refresh_token", newRefreshToken, REFRESH_COOKIE_OPTIONS);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        access_token: accessToken,
        expires_in: 900,
        token_type: "Bearer",
      },
      "Token refreshed successfully.",
    ),
  );
});


const logout = AsyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refresh_token;

  if (incomingToken) {
    const tokenHash = hashToken(incomingToken);

    // Revoke session in DB
    await prisma.session.updateMany({
      where: { token_hash: tokenHash },
      data: { is_revoked: true },
    });
  }


  res.clearCookie("refresh_token", REFRESH_COOKIE_OPTIONS);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully."));
});

export { register, login, refresh, logout };
