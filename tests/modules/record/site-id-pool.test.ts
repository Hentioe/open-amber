import { beforeAll, beforeEach, expect, test } from "bun:test";
import { migrate } from "../../../src/db";
import siteIdPool from "../../../src/modules/record/site-id-pool";

beforeAll(() => {
  migrate(); // 确保数据库迁移已完成
  siteIdPool.initialize(50);
});

beforeEach(() => {
  siteIdPool.extend(); // 确保每次测试前池子都被填满
});

test("getSiteId", () => {
  const siteId = siteIdPool.getSiteId();
  // 测试 siteId 的长度是否为 8
  expect(siteId.length).toBe(8);

  // 测试前四个数字是否等同于当前年份
  const currentYear = new Date().getFullYear().toString();
  expect(siteId.slice(0, 4)).toBe(currentYear);

  // 循环拿去 50 个 siteId
  for (let i = 0; i < 50; i++) {
    const id = siteIdPool.getSiteId();
    // 测试每个 siteId 的长度是否为 8
    expect(id.length).toBe(8);
    // 测试前四个数字是否等同于当前年份
    expect(id.slice(0, 4)).toBe(currentYear);
  }
});

test("getStatus", () => {
  expect(siteIdPool.getStatus().size).toBe(50);
  siteIdPool.getSiteId();
  siteIdPool.getSiteId();
  expect(siteIdPool.getStatus().size).toBe(48);
});
