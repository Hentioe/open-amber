type ApiResponse<T> = ServerData.Success<T> | ServerData.Error;

declare namespace ServerData {
  type ErrorReason =
    | "CAPTCHA_INVALID"
    | "RECORD_EXISTS"
    | "NAME_INVALID"
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

  type Record = {
    siteId: string;
    siteName: string;
    siteDomain: string;
    siteHome: string;
    siteOwner: string;
    siteInfo: string | null;
    siteStatus: "open" | "closed";
    siteModify: string;
  };

  type Captcha = {
    url: string;
    uniqueId: string;
  };

  type RandomCode = {
    siteId: string;
    captcha: Captcha;
  };

  type SubmitPrepare = {
    siteId: string;
    captcha: Captcha;
  };

  type Submitted = {
    message: string;
  };

  type Submitted = {
    message: string;
  };

  type SubmittedUnverified = {
    message: string;
    sender: string;
  };
}

declare namespace InputData {
  type Captcha = {
    text: string;
    uniqueId: string;
  };
}
