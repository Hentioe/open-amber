import staticPlugin from "@elysiajs/static";
import Elysia from "elysia";
import banner from "./banner.txt";
import config from "./config";
import { migrate } from "./db";
import log from "./log";
import { AdminController } from "./modules/admin";
import { FallbackController } from "./modules/fallback";
import { RecordController, siteIdPool } from "./modules/record";
import { ReviewController } from "./modules/review";
import { SharedAssetsController } from "./modules/shared-assets";
import { SubmitController } from "./modules/submit";
import { injectRootServer } from "./modules/submit/controller";
import { seeding } from "./utils";

preparing();

const app = new Elysia()
  .use(log.into({
    customProps: (ctx) => ({
      params: ctx.params,
      query: ctx.query,
    }),
  }))
  .onStart(onStart)
  .onStop(onStop)
  .use(staticPlugin({ prefix: "/", alwaysStatic: true }))
  .use(RecordController)
  .use(SharedAssetsController)
  .use(SubmitController)
  .use(ReviewController)
  .use(AdminController)
  .use(FallbackController)
  .listen(config.PORT);

injectRootServer(app.server); // 子实例的 ratelimit() 需要

function preparing() {
  process.stdout.write(`${banner}\n`);

  migrate();
  seeding();
  siteIdPool.initialize(5);

  log.info("Database migrations and seeds have been applied");
}

function onStart() {
  log.info(`Server is running on http://localhost:${config.PORT}`);
}

function onStop() {
  log.info("Server is stopping...");
}

process.on("SIGINT", shutdown_signal);
process.on("SIGTERM", shutdown_signal);

function shutdown_signal() {
  log.warn("Received SIGINT. Stopping server...");

  app.stop().then(() => {
    log.info("Server stopped");
    process.exit(0);
  });
}
