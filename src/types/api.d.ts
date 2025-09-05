declare namespace Api {
  type ErrorReason =
    | "CAPTCHA_INVALID"
    | "RECORD_EXISTS"
    | "EMAIL_INVALID"
    | "DOMAIN_INVALID"
    | "HOME_INVALID"
    | "INFO_INVALID"
    | "OWNER_INVALID"
    | "REVIEW_PENDING";

  type Error = {
    success: false;
    message: string;
    reason?: ErrorReason;
    payload?: unknown;
  };

  type Success<T> = {
    success: true;
    payload: T;
  };
}
