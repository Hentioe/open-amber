import { Err, Ok, type Result } from "ts-results";
import config from "../config";
import { strictify } from "../helpers";

export async function createLocal(
  params: Captcha.LocalGenParams,
): Promise<Result<Captcha.LocalData, Captcha.Error>> {
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

  switch (resp.status) {
    case 200:
      return Ok(strictify<Captcha.LocalData>(await resp.json()));

    case 500:
      return Err("REMOTE_ERROR");

    default:
      return Err(await resp.json() as Captcha.ErrorPayload);
  }
}
