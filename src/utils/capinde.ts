import config from "../config";
import { strictify } from "../helpers";
import log from "../log";

export async function createLocal(params: Captcha.LocalGenParams) {
  let base_params = {};
  if (params.baseParams) {
    const { length, width, height, darkMode: dark_mode, complexity, compression } = params.baseParams;

    base_params = {
      length,
      width,
      height,
      dark_mode,
      complexity,
      compression,
    };
  }

  const resp = await fetch(`${config.CAPINDE_BASE_URL}/api/captchas?type=classic`, {
    method: "POST",
    body: JSON.stringify({ base_dir: "/out", base_params, ttl_secs: params.ttlSecs }),
    headers: { "Content-Type": "application/json" },
  });

  if (resp.status !== 200) {
    if (resp.status !== 500) {
      const error = await resp.json() as { message: string };
      log.error(`Failed to create CAPTCHA: ${error.message}, status: ${resp.status}`);
    } else {
      log.error(`Failed to create CAPTCHA, status: ${resp.status}`);
    }
  }

  return strictify<Captcha.LocalData>(await resp.json());
}
