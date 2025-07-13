import Elysia, { t } from "elysia";
import { failure, success } from "../../helpers";
import { findRecord, getRecordBy, recentlyVerifiedRecords } from "./service";
import { renderRecord, renderRecords } from "./view";

const MSG_NOT_FOUND = "未找到备案记录";

export default new Elysia()
  .get("/api/records/recently", () => {
    const result = recentlyVerifiedRecords();

    return success(renderRecords(result));
  })
  .get("/api/records/:siteId", ({ params }) => {
    const record = getRecordBy({ siteId: params.siteId });

    if (!record) {
      return failure(MSG_NOT_FOUND);
    }
    if (record.reviewStatus === "pending") {
      return failure("此备案正在审核中", { reason: "REVIEW_PENDING" });
    }

    if (record.reviewStatus === "approved") {
      return success(renderRecord(record));
    } else {
      // 其余状态，如 rejected，返回未找到
      return failure(MSG_NOT_FOUND);
    }
  })
  .get("/api/records/search", ({ query }) => {
    const record = findRecord(query.keyword);
    if (record) {
      return success(renderRecord(record));
    }

    return failure(MSG_NOT_FOUND);
  }, { query: t.Object({ keyword: t.String() }) });
