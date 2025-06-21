import bearer from "@elysiajs/bearer";
import Elysia from "elysia";
import config from "../../config";
import { failure, success } from "../../helpers";
import { deleteRecordBy } from "../record";

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
  .delete("/admin/api/records/:domain", ({ params }) => {
    return success(deleteRecordBy({ siteDomain: params.domain }));
  });
