-- CreateEnum
CREATE TYPE "DistributionType" AS ENUM ('EQUAL', 'WEIGHTED');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('COMPLETED', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "Network" AS ENUM ('MAINNET', 'TESTNET');

-- CreateTable
CREATE TABLE "Distribution" (
    "id" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "transaction_hash" TEXT,
    "token_address" TEXT NOT NULL,
    "token_symbol" TEXT NOT NULL,
    "token_decimals" INTEGER NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "fee_amount" DECIMAL(65,30) NOT NULL,
    "total_recipients" INTEGER NOT NULL,
    "distribution_type" "DistributionType" NOT NULL,
    "status" "DistributionStatus" NOT NULL DEFAULT 'PENDING',
    "block_number" BIGINT,
    "block_timestamp" TIMESTAMP(3),
    "network" "Network" NOT NULL DEFAULT 'MAINNET',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Distribution_user_address_idx" ON "Distribution"("user_address");

-- CreateIndex
CREATE INDEX "Distribution_transaction_hash_idx" ON "Distribution"("transaction_hash");

-- CreateIndex
CREATE INDEX "Distribution_created_at_idx" ON "Distribution"("created_at");

-- CreateIndex
CREATE INDEX "Distribution_status_idx" ON "Distribution"("status");
