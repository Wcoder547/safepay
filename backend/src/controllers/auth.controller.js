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

import { sendSms } from "../services/sms.service.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, hashOtp } from "../utils/otp.js";

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

  
  const isVerified = user.is_verified;

return res.status(200).json(
  new ApiResponse(
    200,
    {
      access_token: accessToken,
      expires_in: 900,
      token_type: "Bearer",
      requires_verification: !isVerified,   // ← frontend checks this
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
    isVerified ? "Logged in successfully." : "Please verify your phone to continue."
  )
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



const me = AsyncHandler(async (req, res) => {
  // req.user is set by authenticate middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      role: true,
      is_verified: true,
      is_frozen: true,
      avatar_url: true,
      created_at: true,
      last_login: true,
      // NEVER select password_hash or pin_hash
      wallet: {
        select: {
          id: true,
          balance: true,
          currency: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.", { code: "NOT_FOUND" });
  }

  return res.status(200).json(
    new ApiResponse(200, { user }, "Profile fetched successfully.")
  );
});




const forgotPassword = AsyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(422, "Phone number is required.", {
      code: "VALIDATION_ERROR",
      fields: { phone: "Phone is required." }
    });
  }

  const user = await prisma.user.findUnique({ where: { phone } });

  // Always same response — prevent phone enumeration
  if (!user) {
    return res.status(200).json(
      new ApiResponse(200, null,
        "If this phone exists, an OTP has been sent."
      )
    );
  }

  if (user.is_frozen) {
    throw new ApiError(403, "Account suspended. Contact support.", {
      code: "ACCOUNT_FROZEN"
    });
  }

  // Expire existing RESET_PASSWORD OTPs
  await prisma.otp.updateMany({
    where: {
      user_id: user.id,
      purpose: "RESET_PASSWORD",
      is_used: false
    },
    data: { is_used: true }
  });

  // Generate OTP
  const otpCode = generateOtp();              // ← your existing util
  const hashedOtp = await hashOtp(otpCode);   // ← your existing util
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.create({
    data: {
      user_id: user.id,
      code_hash: hashedOtp,
      purpose: "RESET_PASSWORD",
      expires_at: expiresAt
    }
  });

  // ✅ Uses your actual SMS service (dev logs, prod sends)
  await sendSms(
    user.phone,
    `Your SafePay password reset code is: ${otpCode}. Valid for 5 minutes. Never share it.`
  );

  return res.status(200).json(
    new ApiResponse(200, {
      expires_in: 300,
      phone_masked: user.phone.replace(/(\d{4})\d{4}(\d{3})/, "$1****$2")
    },
    "If this phone exists, an OTP has been sent."
    )
  );
});



const resetPassword = AsyncHandler(async (req, res) => {
  const { phone, otp_code, new_password, confirm_password } = req.body;


  // Validate all fields present
  if (!phone || !otp_code || !new_password || !confirm_password) {
    throw new ApiError(422, "All fields are required.", {
      code: "VALIDATION_ERROR",
      fields: {
        ...(!phone && { phone: "Phone is required." }),
        ...(!otp_code && { otp_code: "OTP code is required." }),
        ...(!new_password && { new_password: "New password is required." }),
        ...(!confirm_password && { confirm_password: "Confirm password is required." })
      }
    });
  }

  // Passwords match
  if (new_password !== confirm_password) {
    throw new ApiError(422, "Passwords do not match.", {
      code: "VALIDATION_ERROR",
      fields: { confirm_password: "Does not match new_password." }
    });
  }

  // Password strength
  if (!/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(new_password)) {
    throw new ApiError(422, "Password too weak.", {
      code: "VALIDATION_ERROR",
      fields: {
        new_password: "Min 8 chars with at least one special character."
      }
    });
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new ApiError(404, "User not found.", { code: "NOT_FOUND" });
  }

  // Find latest valid OTP
  const otpRecord = await prisma.otp.findFirst({
    where: {
      user_id: user.id,
      purpose: "RESET_PASSWORD",
      is_used: false,
      expires_at: { gt: new Date() }
    },
    orderBy: { created_at: "desc" }
  });

  if (!otpRecord) {
    throw new ApiError(410, "OTP expired or not found. Request a new one.", {
      code: "OTP_EXPIRED"
    });
  }

  // Check attempt limit
  if (otpRecord.attempts >= 3) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { is_used: true }
    });
    throw new ApiError(429, "Too many wrong attempts. Request a new OTP.", {
      code: "OTP_LOCKED"
    });
  }

  // Verify OTP code
  const isOtpValid = await bcrypt.compare(otp_code, otpRecord.code_hash);

  if (!isOtpValid) {
    // Increment attempts
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } }
    });

    const remaining = 2 - otpRecord.attempts;
    throw new ApiError(400, `Incorrect OTP. ${remaining} attempts remaining.`, {
      code: "INVALID_OTP"
    });
  }

  // OTP valid → hash new password + update + mark OTP used
  const hashedPassword = await bcrypt.hash(new_password, 10);

  await prisma.$transaction([
    // Update password
    prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword }
    }),
    // Mark OTP as used
    prisma.otp.update({
      where: { id: otpRecord.id },
      data: { is_used: true }
    }),
    // Revoke ALL sessions → force re-login everywhere
    prisma.session.updateMany({
      where: { user_id: user.id },
      data: { is_revoked: true }
    })
  ]);

  return res.status(200).json(
    new ApiResponse(200, null,
      "Password reset successfully. Please login with your new password."
    )
  );
});

export { register, login, refresh, logout, me, forgotPassword, resetPassword };



