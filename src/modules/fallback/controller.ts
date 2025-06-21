import { file } from "bun";
import Elysia from "elysia";
import { join } from "node:path";

const PUBLIC_DIR = "public";
const ENTRY_HTML = "index.html";

export default new Elysia()
  .get("*", () => {
    return file(join(PUBLIC_DIR, ENTRY_HTML));
  });
