import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import config from "../../config";
import { updateRecordReviewStatus } from "../record";

const jwtPlugin = jwt({
  name: "myJwt",
  secret: config.REVIEW_SECRET,
  exp: "30d", // 30 天后过期
});

export default new Elysia()
  .use(jwtPlugin)
  .get("/review", async ({ query }) => {
    const payload = await jwtPlugin.decorator.myJwt.verify(query.token) as { sub: number; action: string } | false;
    if (payload) {
      if (payload.action === "approve") {
        updateRecordReviewStatus(payload.sub, "approved");
        return "审核通过";
      } else if (payload.action === "reject") {
        updateRecordReviewStatus(payload.sub, "rejected");
        return "审核拒绝";
      } else {
        return "未知的操作";
      }
    } else {
      return "无效或过期的审核操作";
    }
  }, {
    query: t.Object({
      token: t.String(),
    }),
  });

export const reviewJwt = jwtPlugin.decorator.myJwt;
