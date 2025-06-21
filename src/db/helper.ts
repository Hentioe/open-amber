import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const timestames = {
  insertedAt: integer({ mode: "timestamp_ms" }).notNull().default(new Date()),
  updatedAt: integer({ mode: "timestamp_ms" }).notNull().default(new Date()),
};
