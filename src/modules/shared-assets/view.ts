export function renderCaptcha(captcha: Captcha.SuccessPayload) {
  return {
    unique_id: captcha.uniqueId,
    url: `/shared_assets/${captcha.fileName}`,
  };
}
