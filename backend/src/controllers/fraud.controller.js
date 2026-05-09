import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";


const getFraudReports = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(status && { review_status: status }),
  };

  const [reports, total] = await Promise.all([
    prisma.fraudReport.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: parseInt(limit),
      include: {
        transaction: {
          include: {
            sender:   { select: { id: true, full_name: true, phone: true } },
            receiver: { select: { id: true, full_name: true, phone: true } },
          },
        },
        reviewer: {
          select: { id: true, full_name: true },
        },
      },
    }),
    prisma.fraudReport.count({ where }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Fraud reports fetched.")
  );
});


const getFraudReport = AsyncHandler(async (req, res) => {
  const report = await prisma.fraudReport.findUnique({
    where: { id: req.params.id },
    include: {
      transaction: {
        include: {
          sender:   { select: { id: true, full_name: true, phone: true } },
          receiver: { select: { id: true, full_name: true, phone: true } },
        },
      },
      reviewer: {
        select: { id: true, full_name: true },
      },
    },
  });

  if (!report) {
    throw new ApiError(404, "Fraud report not found.", { code: "NOT_FOUND" });
  }

  return res.status(200).json(
    new ApiResponse(200, { report }, "Fraud report fetched.")
  );
});


const overrideFraud = AsyncHandler(async (req, res) => {
  const { admin_note } = req.body;
  const { id } = req.params;

  const report = await prisma.fraudReport.findUnique({
    where: { id },
    include: { transaction: true },
  });

  if (!report) {
    throw new ApiError(404, "Fraud report not found.", { code: "NOT_FOUND" });
  }

  if (report.review_status !== "PENDING") {
    throw new ApiError(400, "Report already reviewed.", {
      code: "ALREADY_REVIEWED",
    });
  }

  // Mark report as false alarm + approve the transaction
  await prisma.$transaction([
    prisma.fraudReport.update({
      where: { id },
      data: {
        review_status: "FALSE_ALARM",
        admin_note:    admin_note || null,
        reviewed_by:   req.user.id,
        reviewed_at:   new Date(),
      },
    }),
    prisma.transaction.update({
      where: { id: report.transaction_id },
      data:  { status: "APPROVED" },
    }),
    // Notify sender — money released
    prisma.notification.create({
      data: {
        user_id:        report.transaction.sender_id,
        transaction_id: report.transaction_id,
        title:          "Transaction Approved ✅",
        message:        `Your blocked transaction of Rs. ${report.transaction.amount} has been reviewed and approved.`,
        type:           "SUCCESS",
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, null, "Transaction approved. Fraud report marked as false alarm.")
  );
});


const confirmFraud = AsyncHandler(async (req, res) => {
  const { admin_note } = req.body;
  const { id } = req.params;

  const report = await prisma.fraudReport.findUnique({
    where: { id },
    include: { transaction: true },
  });

  if (!report) {
    throw new ApiError(404, "Fraud report not found.", { code: "NOT_FOUND" });
  }

  if (report.review_status !== "PENDING") {
    throw new ApiError(400, "Report already reviewed.", {
      code: "ALREADY_REVIEWED",
    });
  }

  await prisma.fraudReport.update({
    where: { id },
    data: {
      review_status: "CONFIRMED_FRAUD",
      admin_note:    admin_note || null,
      reviewed_by:   req.user.id,
      reviewed_at:   new Date(),
    },
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Fraud confirmed and logged.")
  );
});

export { getFraudReports, getFraudReport, overrideFraud, confirmFraud };