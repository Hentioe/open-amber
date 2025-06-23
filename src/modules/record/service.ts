import { SQLiteError } from "bun:sqlite";
import { desc, eq, or } from "drizzle-orm";
import { Err, Ok, Result } from "ts-results";
import db from "../../db";
import { records } from "../../db/schema";
import log from "../../log";

export function getRecordBy({ siteId, siteDomain }: { siteId?: string; siteDomain?: string }) {
  if (!Boolean(siteId) && !Boolean(siteDomain)) {
    return undefined;
  }
  const query = db.select().from(records);
  if (siteId) {
    query.where(eq(records.siteId, siteId));
  }
  if (siteDomain) {
    query.where(eq(records.siteDomain, siteDomain));
  }
  // 默认只查询已审核通过的记录
  query.where(eq(records.reviewStatus, "approved"));

  return query.get();
}

export function createRecord(record: Model.Record) {
  try {
    const created = db.insert(records).values({
      siteId: record.siteId,
      siteName: record.siteName,
      siteDomain: record.siteDomain,
      siteHome: record.siteHome,
      siteInfo: record.siteInfo,
      siteOwner: record.siteOwner,
      siteStatus: record.siteStatus,
      siteModify: record.siteModify,
      ownerEmail: record.ownerEmail,
      reviewStatus: record.reviewStatus,
    }).returning().get();

    return new Ok(created);
  } catch (error) {
    if (error instanceof SQLiteError) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return new Err("此备案已存在，请检查备案码和域名");
      }
      return new Err(error.message);
    } else {
      log.error("Error creating record:", error);

      return new Err("创建备案记录时发生了未知错误");
    }
  }
}

export function updateRecord(siteId: string, record: Model.UpdateRecord): Result<Model.Record, SQLiteError> {
  try {
    const created = db.update(records).set({
      siteName: record.siteName,
      siteHome: record.siteHome,
      siteInfo: record.siteInfo,
      siteOwner: record.siteOwner,
      siteStatus: record.siteStatus,
      ownerEmail: record.ownerEmail,
      reviewStatus: record.reviewStatus,
    })
      .where(eq(records.siteId, siteId))
      .returning().get();

    return new Ok(created);
  } catch (error) {
    return new Err(error as SQLiteError);
  }
}

export function updateRecordReviewStatus(id: number, reviewStatus: Model.ReviewStatus) {
  return db.update(records)
    .set({ reviewStatus, updatedAt: new Date() })
    .where(eq(records.id, id))
    .returning().get();
}

export function recentlyVerifiedRecords(limit: number = 50) {
  return db.select()
    .from(records)
    .where(eq(records.reviewStatus, "approved"))
    .orderBy(desc(records.siteModify))
    .limit(limit).all();
}

export function getRecords(limit: number = 50) {
  return db.select()
    .from(records)
    .orderBy(desc(records.insertedAt))
    .limit(limit).all();
}

export function deleteRecord(id: number) {
  db.delete(records).where(eq(records.id, id)).returning().run();
}

export function findRecord(keyword: string) {
  return db.select()
    .from(records)
    .where(or(eq(records.siteId, keyword), eq(records.siteDomain, keyword)))
    .get();
}

export function deleteRecordBy({ siteId, siteDomain }: { siteId?: string; siteDomain?: string }) {
  if (!Boolean(siteId) && !Boolean(siteDomain)) {
    return;
  }

  const base = db.delete(records);
  if (siteId) {
    base.where(eq(records.siteId, siteId));
  } else if (siteDomain) {
    base.where(eq(records.siteDomain, siteDomain));
  }

  return base.returning().get();
}
