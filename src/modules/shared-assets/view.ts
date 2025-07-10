import config from "../../config";

export function renderCaptcha(captcha: Captcha.Generated) {
  let url: string;

  if (captcha.workingMode == "hosted") {
    console.log(captcha.namespace);
    url = `${config.CAPINDE_BASE_URL}/assets/${captcha.namespace}/${captcha.fileName}`;
  } else {
    url = `/shared_assets/${captcha.fileName}`;
  }

  return {
    unique_id: captcha.uniqueId,
    url: url,
  };
}
