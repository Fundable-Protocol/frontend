import {
  pgTable,
  timestamp,
  text,
  uniqueIndex,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { generateUUID } from "@/lib/utils";

export const userModel = pgTable(
  "User",
  {
    id: text().$default(generateUUID).primaryKey().notNull(),
    username: text().notNull(),
    email: text().notNull(),

    // renamed fields ↓
    created_at: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    uniqueIndex("User_email_key").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops")
    ),
  ]
);

export const userAccessModel = pgTable(
  "UserAccess",
  {
    id: text().$default(generateUUID).primaryKey(),
    user_id: text().notNull(),
    password: text().notNull(),
    created_at: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    uniqueIndex("UserAccess_userId_key").using(
      "btree",
      table.user_id.asc().nullsLast().op("text_ops")
    ),
  ]
);

export const sessionModel = pgTable(
  "Session",
  {
    id: text().$default(generateUUID).primaryKey(),
    user_id: text().notNull(),
    active: boolean().default(true).notNull(),
    token_hash: text().notNull(),
    fingerprint_hash: text().notNull(),
    device_fingerprint: text(),
    last_active_at: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    created_at: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expires_at: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("Session_tokenHash_key").using(
      "btree",
      table.token_hash.asc().nullsLast().op("text_ops")
    ),
    uniqueIndex("Session_userId_fingerprintHash_key").using(
      "btree",
      table.user_id.asc().nullsLast().op("text_ops"),
      table.fingerprint_hash.asc().nullsLast().op("text_ops")
    ),
    index("Session_userId_idx").using(
      "btree",
      table.user_id.asc().nullsLast().op("text_ops")
    ),
  ]
);
