CREATE TYPE "user_role" AS ENUM (
  'user',
  'admin'
);

CREATE TYPE "txn_status" AS ENUM (
  'PENDING',
  'APPROVED',
  'BLOCKED',
  'FAILED',
  'REVERSED'
);

CREATE TYPE "log_type" AS ENUM (
  'DEBIT',
  'CREDIT',
  'TOPUP',
  'REFUND'
);

CREATE TYPE "review_status" AS ENUM (
  'PENDING',
  'CONFIRMED_FRAUD',
  'FALSE_ALARM'
);

CREATE TYPE "notif_type" AS ENUM (
  'SUCCESS',
  'WARNING',
  'FRAUD_ALERT',
  'INFO'
);

CREATE TYPE "otp_purpose" AS ENUM (
  'PHONE_VERIFY',
  'LOGIN',
  'RESET_PIN',
  'RESET_PASSWORD'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "full_name" varchar(100) NOT NULL,
  "email" varchar(150) UNIQUE NOT NULL,
  "phone" varchar(20) UNIQUE NOT NULL,
  "cnic" varchar(20) UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "pin_hash" text NOT NULL,
  "role" user_role NOT NULL DEFAULT 'user',
  "is_frozen" boolean NOT NULL DEFAULT false,
  "is_verified" boolean NOT NULL DEFAULT false,
  "avatar_url" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "last_login" timestamp
);

CREATE TABLE "wallets" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid UNIQUE NOT NULL,
  "balance" decimal(14,2) NOT NULL DEFAULT 0,
  "currency" varchar(5) NOT NULL DEFAULT 'PKR',
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "transactions" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "sender_id" uuid NOT NULL,
  "receiver_id" uuid NOT NULL,
  "amount" decimal(14,2) NOT NULL,
  "note" text,
  "status" txn_status NOT NULL DEFAULT 'PENDING',
  "risk_score" decimal(5,2),
  "is_fraud" boolean NOT NULL DEFAULT false,
  "fraud_reasons" text[],
  "device_ip" varchar(50),
  "device_type" varchar(20),
  "location" varchar(100),
  "hour_of_day" smallint,
  "sender_txn_count" integer DEFAULT 0,
  "receiver_txn_count" integer DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "wallet_logs" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "transaction_id" uuid,
  "type" log_type NOT NULL,
  "amount" decimal(14,2) NOT NULL,
  "balance_before" decimal(14,2) NOT NULL,
  "balance_after" decimal(14,2) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "fraud_reports" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "transaction_id" uuid UNIQUE NOT NULL,
  "risk_score" decimal(5,2) NOT NULL,
  "fraud_signals" text[],
  "ml_model_version" varchar(20),
  "review_status" review_status NOT NULL DEFAULT 'PENDING',
  "reviewed_by" uuid,
  "admin_note" text,
  "reviewed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "notifications" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "transaction_id" uuid,
  "title" varchar(100) NOT NULL,
  "message" text NOT NULL,
  "type" notif_type NOT NULL,
  "is_read" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "token_hash" text NOT NULL,
  "device_info" text,
  "ip_address" varchar(50),
  "is_revoked" boolean NOT NULL DEFAULT false,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "otps" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "code_hash" text NOT NULL,
  "purpose" otp_purpose NOT NULL,
  "is_used" boolean NOT NULL DEFAULT false,
  "attempts" smallint DEFAULT 0,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email");

CREATE UNIQUE INDEX "idx_users_phone" ON "users" ("phone");

CREATE UNIQUE INDEX "idx_users_cnic" ON "users" ("cnic");

CREATE INDEX "idx_users_frozen" ON "users" ("is_frozen");

CREATE UNIQUE INDEX "idx_wallets_user" ON "wallets" ("user_id");

CREATE INDEX "idx_txn_sender" ON "transactions" ("sender_id");

CREATE INDEX "idx_txn_receiver" ON "transactions" ("receiver_id");

CREATE INDEX "idx_txn_status" ON "transactions" ("status");

CREATE INDEX "idx_txn_fraud" ON "transactions" ("is_fraud");

CREATE INDEX "idx_txn_created" ON "transactions" ("created_at");

CREATE INDEX "idx_txn_sender_time" ON "transactions" ("sender_id", "created_at");

CREATE INDEX "idx_txn_fraud_status" ON "transactions" ("is_fraud", "status");

CREATE INDEX "idx_wlog_user" ON "wallet_logs" ("user_id");

CREATE INDEX "idx_wlog_txn" ON "wallet_logs" ("transaction_id");

CREATE INDEX "idx_wlog_user_time" ON "wallet_logs" ("user_id", "created_at");

CREATE UNIQUE INDEX "idx_fraud_txn" ON "fraud_reports" ("transaction_id");

CREATE INDEX "idx_fraud_review_status" ON "fraud_reports" ("review_status");

CREATE INDEX "idx_fraud_admin" ON "fraud_reports" ("reviewed_by");

CREATE INDEX "idx_notif_user" ON "notifications" ("user_id");

CREATE INDEX "idx_notif_unread" ON "notifications" ("user_id", "is_read");

CREATE INDEX "idx_notif_time" ON "notifications" ("created_at");

CREATE INDEX "idx_sess_user" ON "sessions" ("user_id");

CREATE INDEX "idx_sess_token" ON "sessions" ("token_hash");

CREATE INDEX "idx_sess_expiry" ON "sessions" ("expires_at");

CREATE INDEX "idx_otp_user" ON "otps" ("user_id");

CREATE INDEX "idx_otp_expiry" ON "otps" ("expires_at");

COMMENT ON TABLE "users" IS 'Core user accounts. One row per registered user.';

COMMENT ON COLUMN "users"."id" IS 'Primary key';

COMMENT ON COLUMN "users"."phone" IS 'Used to send/receive money';

COMMENT ON COLUMN "users"."cnic" IS 'Pakistani national ID — unique identity';

COMMENT ON COLUMN "users"."password_hash" IS 'bcrypt hashed — never store plain text';

COMMENT ON COLUMN "users"."pin_hash" IS 'Separate 4-digit transaction PIN, bcrypt hashed';

COMMENT ON COLUMN "users"."is_frozen" IS 'Admin can freeze suspicious accounts';

COMMENT ON COLUMN "users"."is_verified" IS 'Phone verified via OTP';

COMMENT ON TABLE "wallets" IS 'One wallet per user. Balance enforced non-negative at DB level.';

COMMENT ON COLUMN "wallets"."user_id" IS 'One-to-one with users';

COMMENT ON COLUMN "wallets"."balance" IS 'CHECK balance >= 0 enforced in migration';

COMMENT ON TABLE "transactions" IS 'Constraints enforced in Prisma migration:
  CHECK (sender_id != receiver_id)   -- no self-transfers
  CHECK (amount > 0)                 -- positive amounts only
  CHECK (hour_of_day BETWEEN 0 AND 23)
  CHECK (risk_score BETWEEN 0 AND 100)
';

COMMENT ON COLUMN "transactions"."amount" IS 'CHECK amount > 0';

COMMENT ON COLUMN "transactions"."note" IS 'Optional message from sender e.g. rent, lunch';

COMMENT ON COLUMN "transactions"."risk_score" IS '0.00 to 100.00 from ML model';

COMMENT ON COLUMN "transactions"."fraud_reasons" IS 'Array: unusual_hour, large_amount, new_device...';

COMMENT ON COLUMN "transactions"."device_type" IS 'mobile or web';

COMMENT ON COLUMN "transactions"."hour_of_day" IS '0-23, captured at transaction time';

COMMENT ON COLUMN "transactions"."sender_txn_count" IS 'Sender total transactions at time of txn';

COMMENT ON COLUMN "transactions"."receiver_txn_count" IS 'Receiver total transactions at time of txn';

COMMENT ON TABLE "wallet_logs" IS 'balance_before - balance_after = amount for DEBIT. balance_after - balance_before = amount for CREDIT.';

COMMENT ON COLUMN "wallet_logs"."transaction_id" IS 'Null for top-ups without a transaction';

COMMENT ON TABLE "fraud_reports" IS 'One report per blocked transaction. Admin reviews here.';

COMMENT ON COLUMN "fraud_reports"."fraud_signals" IS 'Same array as transactions.fraud_reasons — denormalized for speed';

COMMENT ON COLUMN "fraud_reports"."ml_model_version" IS 'e.g. v1.2.0 — track which model version flagged this';

COMMENT ON COLUMN "fraud_reports"."reviewed_by" IS 'Admin user who reviewed';

COMMENT ON TABLE "notifications" IS 'In-app alerts delivered via Socket.io and stored here.';

COMMENT ON COLUMN "notifications"."transaction_id" IS 'Optional link to a transaction';

COMMENT ON TABLE "sessions" IS 'Tracks active JWT sessions. Enables logout-everywhere and suspicious login detection.';

COMMENT ON COLUMN "sessions"."token_hash" IS 'SHA-256 of JWT — never store raw token';

COMMENT ON COLUMN "sessions"."device_info" IS 'User-Agent string';

COMMENT ON TABLE "otps" IS 'Short-lived one-time passwords for phone verification and 2FA.';

COMMENT ON COLUMN "otps"."code_hash" IS 'bcrypt hashed OTP code';

COMMENT ON COLUMN "otps"."attempts" IS 'Lock after 3 wrong attempts';

COMMENT ON COLUMN "otps"."expires_at" IS 'OTPs expire after 5 minutes';

ALTER TABLE "wallets" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "transactions" ADD FOREIGN KEY ("sender_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "transactions" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "wallet_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "wallet_logs" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fraud_reports" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fraud_reports" ADD FOREIGN KEY ("reviewed_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "sessions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "otps" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
