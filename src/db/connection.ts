import { file } from "bun";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

async function dbPath() {
  const dirPath = "data";

  if (!(await file(dirPath).exists())) {
    await mkdir(dirPath, { recursive: true });
  }

  return join(dirPath, "open-amber.sqlite");
}

const sqlite = new Database(await dbPath());
export default drizzle(sqlite, { casing: "snake_case" });
