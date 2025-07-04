import { Err, Ok, type Result } from "ts-results";
import config from "../config";
import { strictify } from "../helpers";

export async function generate(
  params: Captcha.Params,
): Promise<Result<Captcha.SuccessPayload, Captcha.Error>> {
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

  const resp = await fetch(`${config.CAPINDE_BASE_URL}/api/generate`, {
    method: "POST",
    body: JSON.stringify({
      namespace: "/out",
      ttl_secs: params.ttlSecs,
      special_params: { type: "classic", ...base_params },
    }),
    headers: { "Content-Type": "application/json" },
  });

  switch (resp.status) {
    case 200:
      return Ok(strictify<Captcha.SuccessPayload>(await resp.json()));

    case 500:
      return Err("REMOTE_ERROR");

    default:
      return Err(await resp.json() as Captcha.ErrorPayload);
  }
}
