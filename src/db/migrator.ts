import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import db from ".";

export function run() {
  migrate(db, { migrationsFolder: "./drizzle" });
}
