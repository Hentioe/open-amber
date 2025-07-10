export function captchaErrorMessage(error: Captcha.Error) {
  if (error === "REMOTE_ERROR") {
    return "验证码服务异常";
  } else {
    return error.message;
  }
}
