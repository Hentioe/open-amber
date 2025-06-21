import config from "../config";
import { strictify } from "../helpers";

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

  const resp = await (await fetch(`${config.CAPINDE_BASE_URL}/api/gen/local`, {
    method: "POST",
    body: JSON.stringify({ base_dir: "/out", base_params, ttl_secs: params.ttlSecs }),
    headers: { "Content-Type": "application/json" },
  })).json();

  return strictify<Captcha.LocalData>(resp);
}
