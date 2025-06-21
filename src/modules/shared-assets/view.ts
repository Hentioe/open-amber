export function renderCaptcha(captcha: Captcha.LocalData) {
  return {
    url: `/shared_assets/${captcha.fileName}`,
  };
}
