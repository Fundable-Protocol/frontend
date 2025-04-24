import {
  pgTable,
  timestamp,
  text,
  uniqueIndex,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const walletModel = pgTable(
  "Wallet",
  {
    id: serial().primaryKey().notNull(),
    address: text().notNull(),
    created_at: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    uniqueIndex("Wallet_address_key").using(
      "btree",
      table.address.asc().nullsLast().op("text_ops")
    ),
  ]
);
