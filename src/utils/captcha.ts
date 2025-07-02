import { cache } from ".";

export function verify(uniqueId: string, input: string): boolean {
  const code = cache.get<string>(cache.keygen("cap", uniqueId));
  if (code) {
    return code.toUpperCase() === input.toUpperCase();
  }

  return false;
}

export function captchaErrorMessage(error: Captcha.Error) {
  if (error === "REMOTE_ERROR") {
    return "验证码服务异常";
  } else {
    return error.message;
  }
}
