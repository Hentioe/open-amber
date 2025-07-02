import jwt from "@elysiajs/jwt";
import type { Server } from "bun";
import Elysia, { t } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import config from "../../config";
import { failure, success } from "../../helpers";
import log from "../../log";
import { cache, capinde, captcha } from "../../utils";
import { captchaErrorMessage } from "../../utils/captcha";
import recend from "../../utils/recend";
import { createRecord, getRecordBy, siteIdPool } from "../record";
import { renderRecord } from "../record/view";
import { reviewJwt } from "../review";
import { checkFields } from "./service";
import { renderPrepare } from "./view";

let rootServer: Server | null;

export function injectRootServer(server: Server | null) {
  rootServer = server;
}

const myJwt = jwt({
  name: "myJwt",
  secret: config.VERIFY_SECRET,
  exp: "1h", // 1 小时后过期
});

const prepareApis = new Elysia()
  .use(rateLimit({
    duration: 1000,
    max: 1,
    errorResponse: new Response(JSON.stringify(failure("请求太快，请稍后再试")), {
      headers: { "Content-Type": "application/json" },
    }),
    injectServer: () => rootServer,
    scoping: "scoped",
  }))
  .use(myJwt)
  .get("/api/submit/unverified/prepare", async () => {
    const siteId = siteIdPool.getSiteId();
    const result = await capinde.createLocal({
      baseDir: "/out",
      baseParams: {
        length: 5,
        width: 150,
        height: 50,
        complexity: config.CAPTCHA_COMPLEXITY,
      },
      ttlSecs: config.CAPTCHA_TTL,
    });

    if (result.ok) {
      cache.set(cache.keygen("cap", result.val.uniqueId), result.val.text, 1000 * config.CAPTCHA_TTL);

      return success(renderPrepare(siteId, result.val));
    } else {
      return failure(captchaErrorMessage(result.val));
    }
  })
  .get("/api/submit/prepare", async ({ myJwt, cookie: { auth } }) => {
    const profile = await myJwt.verify(auth?.value) as { email: string; siteId: string } | false;

    if (profile) {
      // 检查 siteId 是否存在记录，如果已存在则返回错误
      const record = getRecordBy({ siteId: profile.siteId });
      if (record) {
        return failure("此备案已经提交过了", {
          reason: "RECORD_EXISTS",
          payload: renderRecord(record),
        });
      }

      const result = await capinde.createLocal({
        baseDir: "/out",
        baseParams: {
          length: 4,
          width: 150,
          height: 50,
          complexity: 1, // 始终最低难度
        },
        ttlSecs: config.CAPTCHA_TTL,
      });

      if (result.ok) {
        cache.set(cache.keygen("cap", result.val.uniqueId), result.val.text, 1000 * config.CAPTCHA_TTL);

        return success(renderPrepare(profile.siteId, result.val));
      } else {
        return failure(captchaErrorMessage(result.val));
      }
    } else {
      return failure("未找到提交者信息，请从邮箱验证");
    }
  });

export default new Elysia()
  .use(myJwt)
  .use(prepareApis)
  .post("/api/submit/unverified", async ({ myJwt, body }) => {
    if (captcha.verify(body.captcha.unique_id, body.captcha.text)) {
      // 检查邮箱格式是否正确
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return failure("邮箱格式不正确", { reason: "EMAIL_INVALID" });
      }
      // 验证成功删除验证码缓存
      cache.del(cache.keygen("cap", body.captcha.unique_id));

      // 生成 token
      const token = await myJwt.sign({
        email: body.email,
        siteId: body.site_id,
      });

      // 发送邮件
      recend.emails.send({
        from: config.RESEND_SENDER,
        to: body.email,
        subject: "OpenAmber：验证您的邮箱",
        text: `点此继续提交申请：${config.BASE_URL}/submit/verify?token=${token}`,
      });

      return success({
        message: "邮件已发送，请从邮箱进入提交步骤",
        sender: config.RESEND_SENDER,
      });
    } else {
      return failure("验证码输入错误或已过期", { reason: "CAPTCHA_INVALID" });
    }
  }, {
    body: t.Object({
      site_id: t.String(),
      email: t.String(),
      captcha: t.Object({
        text: t.String(),
        unique_id: t.String(),
      }),
    }),
  })
  .get("/submit/verify", async ({ myJwt, query, redirect, cookie: { auth } }) => {
    const payload = await myJwt.verify(query.token);

    if (payload) {
      const { email, siteId } = payload as { email: string; siteId: number };
      const key = cache.keygen("unverified", siteId);

      if (!cache.get(key)) {
        // 将预提交信息添加到缓存
        cache.set(key, { email, siteId }, 1000 * 60 * 60); // 1 小时后过期
        // 输出日志：预提交信息已缓存
        log.info(`Pre-submission info cached for siteId ${siteId} and email ${email}`);
      } else {
        // 重复验证，忽略
        log.info(`Repeated verification for siteId ${siteId} and email ${email}, ignoring`);
      }

      // 将 token 设置到 cookie 中
      auth?.set({
        value: query.token,
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 小时后过期
      });

      // 重定向到 /submit 页面开始提交
      return redirect("/submit");
    } else {
      // 如果验证失败，返回错误信息
      return "无效或已过期的验证链接";
    }
  }, {
    query: t.Object({
      token: t.String(),
    }),
  })
  .post("/api/submit", async ({ myJwt, body, cookie: { auth } }) => {
    const profile = await myJwt.verify(auth?.value) as JWT.SubmitOptions | false;

    if (profile) {
      if (!captcha.verify(body.captcha.unique_id, body.captcha.text)) {
        return failure("验证码输入错误或已过期", { reason: "CAPTCHA_INVALID" });
      }

      const checkedError = checkFields(body);
      if (checkedError) return checkedError;

      // 验证成功删除验证码缓存
      cache.del(cache.keygen("cap", body.captcha.unique_id));
      // 创建一个未审核的 record
      const result = createRecord({
        siteId: profile.siteId,
        siteName: body.name,
        siteDomain: body.domain,
        siteHome: body.home,
        siteOwner: body.owner,
        siteInfo: body.info || null,
        siteStatus: "open",
        siteModify: new Date(),
        ownerEmail: profile.email,
        reviewStatus: "pending",
      });

      if (result.err) {
        return failure(result.val);
      }
      const record = result.val;

      // 创建审核链接：同意和拒绝
      const sub = record.id!.toString();
      const approveToken = await reviewJwt.sign({
        sub,
        action: "approve",
      });
      const rejectToken = await reviewJwt.sign({
        sub,
        action: "reject",
      });

      // 发送邮件
      recend.emails.send({
        from: config.RESEND_SENDER,
        to: profile.email,
        subject: "OpenAmber：新的备案申请",
        text: `
          基本信息：
          - 站点名称：${body.name}
          - 站点域名：${body.domain}
          - 站点主页：${body.home}
          - 站点所有者：${body.owner}
          - 站点信息：${body.info || "无"}

          审核链接：
          通过：${config.BASE_URL}/review?token=${approveToken}
          拒绝：${config.BASE_URL}/review?token=${rejectToken}
          `,
      });

      return success({ message: "提交成功，请等待审核 (*´∀`)~♥" });
    } else {
      return failure("未找到提交者信息，请从邮箱验证");
    }
  }, {
    body: t.Object({
      name: t.String(),
      domain: t.String(),
      home: t.String(),
      owner: t.String(),
      info: t.Optional(t.String()),
      captcha: t.Object({
        text: t.String(),
        unique_id: t.String(),
      }),
    }),
  });
