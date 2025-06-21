import { renderCaptcha } from "../shared-assets";

export function renderPrepare(siteId: number | string, captcha: Captcha.LocalData) {
  return {
    site_id: siteId,
    captcha: renderCaptcha(captcha),
  };
}
