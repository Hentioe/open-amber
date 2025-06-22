export function renderCaptcha(captcha: Captcha.LocalData) {
  return {
    unique_id: captcha.uniqueId,
    url: `/shared_assets/${captcha.fileName}`,
  };
}
