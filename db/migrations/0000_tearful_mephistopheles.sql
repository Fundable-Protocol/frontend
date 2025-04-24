-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."DistributionStatus" AS ENUM('COMPLETED', 'FAILED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."DistributionType" AS ENUM('EQUAL', 'WEIGHTED');--> statement-breakpoint
CREATE TYPE "public"."Network" AS ENUM('MAINNET', 'TESTNET');--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Wallet" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Distribution" (
	"id" text PRIMARY KEY NOT NULL,
	"user_address" text NOT NULL,
	"transaction_hash" text,
	"token_address" text NOT NULL,
	"token_symbol" text NOT NULL,
	"token_decimals" integer NOT NULL,
	"total_amount" numeric(65, 30) NOT NULL,
	"fee_amount" numeric(65, 30) NOT NULL,
	"total_recipients" integer NOT NULL,
	"distribution_type" "DistributionType" NOT NULL,
	"status" "DistributionStatus" DEFAULT 'PENDING' NOT NULL,
	"block_number" bigint,
	"block_timestamp" timestamp(3),
	"network" "Network" DEFAULT 'MAINNET' NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserAccess" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"tokenHash" text NOT NULL,
	"fingerprintHash" text NOT NULL,
	"deviceFingerprint" text,
	"lastActiveAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expiresAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet" USING btree ("address" text_ops);--> statement-breakpoint
CREATE INDEX "Distribution_created_at_idx" ON "Distribution" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Distribution_status_idx" ON "Distribution" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "Distribution_transaction_hash_idx" ON "Distribution" USING btree ("transaction_hash" text_ops);--> statement-breakpoint
CREATE INDEX "Distribution_user_address_idx" ON "Distribution" USING btree ("user_address" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserAccess_userId_key" ON "UserAccess" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session" USING btree ("tokenHash" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Session_userId_fingerprintHash_key" ON "Session" USING btree ("userId" text_ops,"fingerprintHash" text_ops);--> statement-breakpoint
CREATE INDEX "Session_userId_idx" ON "Session" USING btree ("userId" text_ops);
*/