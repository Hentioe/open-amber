import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";
import config from "../../config";
import { failure, success } from "../../helpers";
import { createRecord, deleteRecordBy, getRecords, updateRecord } from "../record";
import { renderRecord, renderRecords } from "./view";

const reviewStatusField = t.Optional(t.Union([t.Literal("pending"), t.Literal("approved"), t.Literal("rejected")]));

const createRecordBody = t.Object({
  site_id: t.String(),
  site_name: t.String(),
  site_domain: t.String(),
  site_home: t.String(),
  site_owner: t.String(),
  site_info: t.Optional(t.String()),
  owner_email: t.String(),
  review_status: reviewStatusField,
});

const updateRecordBody = t.Object({
  site_name: t.Optional(t.String()),
  site_domain: t.Optional(t.String()),
  site_home: t.Optional(t.String()),
  site_owner: t.Optional(t.String()),
  site_info: t.Optional(t.String()),
  owner_email: t.Optional(t.String()),
  site_status: t.Optional(t.String()),
  review_status: reviewStatusField,
});

export default new Elysia()
  .use(bearer())
  .onBeforeHandle(async ({ bearer }) => {
    if (!bearer || bearer !== config.ADMIN_API_KEY) {
      return new Response(JSON.stringify(failure("Unauthorized")), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  })
  .get("/admin/api/records", () => {
    return success(renderRecords(getRecords()));
  })
  .post("/admin/api/records", ({ body }) => {
    const result = createRecord({
      siteId: body.site_id,
      siteName: body.site_name,
      siteDomain: body.site_domain,
      siteHome: body.site_home,
      siteOwner: body.site_owner,
      siteInfo: body.site_info || null,
      siteStatus: "open",
      siteModify: new Date(),
      ownerEmail: body.owner_email,
      reviewStatus: body.review_status || "pending",
    });

    if (result.ok) {
      return success(renderRecord(result.val));
    } else {
      return failure(result.val);
    }
  }, {
    body: createRecordBody,
  })
  .put("/admin/api/records/:site_id", ({ params, body }) => {
    const result = updateRecord(params.site_id, {
      siteName: body.site_name,
      siteHome: body.site_home,
      siteOwner: body.site_owner,
      siteInfo: body.site_info,
      ownerEmail: body.owner_email,
      reviewStatus: body.review_status,
    });

    if (result.ok) {
      return success(renderRecord(result.val));
    } else {
      return failure(result.val.message);
    }
  }, {
    body: updateRecordBody,
  })
  .delete("/admin/api/records/:domain", ({ params }) => {
    return success(deleteRecordBy({ siteDomain: params.domain }));
  });
