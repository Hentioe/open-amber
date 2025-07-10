import { Err, Ok, type Result } from "ts-results";
import config from "../config";
import { strictify } from "../helpers";

export async function generate(
  params: Captcha.GenerateParams,
): Promise<Result<Captcha.Generated, Captcha.Error>> {
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
      namespace: "out",
      ttl_secs: params.ttlSecs,
      special_params: { type: "classic", ...base_params },
    }),
    headers: buildHeaders(),
  });

  switch (resp.status) {
    case 200:
      return Ok(strictify<Captcha.Generated>(await resp.json()));

    case 500:
      return Err("REMOTE_ERROR");

    default:
      return Err(await resp.json() as Captcha.ErrorPayload);
  }
}

export async function verify(params: Captcha.VerfyParams): Promise<Result<Captcha.VerifyResult, Captcha.Error>> {
  const resp = await fetch(`${config.CAPINDE_BASE_URL}/api/verify`, {
    method: "POST",
    body: JSON.stringify({
      unique_id: params.uniqueId,
      answer: {
        type: "classic",
        text: params.answer.text,
        ignore_case: params.answer.ignoreCase,
      },
    }),
    headers: buildHeaders(),
  });

  switch (resp.status) {
    case 200:
      return Ok(strictify<Captcha.VerifyResult>(await resp.json()));

    case 500:
      return Err("REMOTE_ERROR");

    default:
      return Err(await resp.json() as Captcha.ErrorPayload);
  }
}

function buildHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.CAPINDE_API_KEY}`,
  };
}
