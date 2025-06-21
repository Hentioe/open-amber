import { file } from "bun";
import { BunSQLiteCache } from "bun-sqlite-cache";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

async function dbPath() {
  const dirPath = "data";

  if (!(await file(dirPath).exists())) {
    // 不存在就创建 `dirPath`
    await mkdir(dirPath, { recursive: true });
  }

  return join(dirPath, "cache.sqlite");
}
const cache = new BunSQLiteCache({
  database: await dbPath(),
});

export function get<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function set(key: string, value: any, ttlMs: number) {
  cache.set(key, value, { ttlMs });
}

export function del(key: string) {
  cache.delete(key);
}

export function keygen(prefix: "cap" | "unverified", value: string | number) {
  return `${prefix}-${value}`;
}
