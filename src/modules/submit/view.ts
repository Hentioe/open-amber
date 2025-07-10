import { renderCaptcha } from "../shared-assets";

export function renderPrepare(siteId: number | string, captcha: Captcha.Generated) {
  return {
    site_id: siteId,
    captcha: renderCaptcha(captcha),
  };
}
