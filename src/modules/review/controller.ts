import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import config from "../../config";
import recend from "../../utils/recend";
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
        const record = updateRecordReviewStatus(payload.sub, "approved");
        // 发邮件通知审核通过
        recend.emails.send({
          from: config.RESEND_SENDER,
          to: record.ownerEmail,
          subject: `OpenAmber：备案审核通过（${record.siteDomain}）`,
          text: `
          您好，${record.siteOwner}！
          您的备案申请已通过审核，备案信息如下：
          - 备案号：${record.siteId}
          - 域名：${record.siteDomain}
          - 备案状态：已通过审核
          `,
        });

        return "已通过此申请";
      } else if (payload.action === "reject") {
        updateRecordReviewStatus(payload.sub, "rejected");
        return "已拒绝此申请";
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
