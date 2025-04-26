import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" }); // or .env.local

const client = neon(process.env.DATABASE_URL!);

export const db = drizzle(client, {
  casing: "snake_case",
});
