import {
  pgTable,
  timestamp,
  text,
  integer,
  index,
  numeric,
  bigint,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { generateUUID } from "@/lib/utils";

export const distribution_status = pgEnum("distribution_status", [
  "COMPLETED",
  "FAILED",
  "PENDING",
]);

export const distribution_type = pgEnum("distribution_type", [
  "EQUAL",
  "WEIGHTED",
]);

export const network = pgEnum("network", ["MAINNET", "TESTNET"]);

export const distributionModel = pgTable(
  "Distribution",
  {
    id: text().$default(generateUUID).primaryKey().notNull(),
    user_address: text("user_address").notNull(),
    transaction_hash: text("transaction_hash"),
    token_address: text("token_address").notNull(),
    token_symbol: text("token_symbol").notNull(),
    token_decimals: integer("token_decimals").notNull(),
    total_amount: numeric("total_amount", {
      precision: 65,
      scale: 30,
    }).notNull(),
    fee_amount: numeric("fee_amount", { precision: 65, scale: 30 }).notNull(),
    total_recipients: integer("total_recipients").notNull(),
    distribution_type: distribution_type("distribution_type").notNull(),
    status: distribution_status().default("PENDING").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    block_number: bigint("block_number", { mode: "number" }),
    block_timestamp: timestamp("block_timestamp", {
      precision: 3,
      mode: "date",
    }),
    network: network().default("MAINNET").notNull(),
    created_at: timestamp("created_at", { precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    metadata: jsonb(),
  },
  (table) => [
    index("Distribution_created_at_idx").using(
      "btree",
      table.created_at.asc().nullsLast().op("timestamp_ops")
    ),
    index("Distribution_status_idx").using(
      "btree",
      table.status.asc().nullsLast().op("enum_ops")
    ),
    index("Distribution_transaction_hash_idx").using(
      "btree",
      table.transaction_hash.asc().nullsLast().op("text_ops")
    ),
    index("Distribution_user_address_idx").using(
      "btree",
      table.user_address.asc().nullsLast().op("text_ops")
    ),
  ]
);
