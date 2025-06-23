import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestames } from "../helper";
import { encrypted } from "../types";

export default sqliteTable("records", {
  id: integer().primaryKey(),
  siteId: text().notNull().unique(),
  siteName: text().notNull(),
  siteDomain: text().notNull().unique(),
  siteHome: text().notNull(),
  siteInfo: text(),
  siteOwner: text().notNull(),
  siteStatus: text({ enum: ["open", "closed"] }).notNull().default("open"),
  siteModify: integer({ mode: "timestamp" }).notNull(),
  ownerEmail: encrypted.text().notNull(),
  reviewStatus: text({ enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  ...timestames,
});
