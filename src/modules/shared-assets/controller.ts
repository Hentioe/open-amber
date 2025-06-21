import { file } from "bun";
import Elysia from "elysia";
import { basename, join } from "node:path";
import { failure } from "../../helpers";

export default new Elysia()
  .get("/shared_assets/*", async ({ path }) => {
    // todo：这里可能要进行安全检查或转换
    const assets = file(join("shared_assets", basename(path)));
    if (await assets.exists()) {
      return assets;
    } else {
      return failure("没有找到此资源");
    }
  });
