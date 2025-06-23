import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const timestames = {
  insertedAt: integer({ mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer({ mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
};
