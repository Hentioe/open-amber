type ApiResponse<T> = Api.Success<T> | Api.Error;

declare namespace Api {
  type ErrorReason =
    | "CAPTCHA_INVALID"
    | "RECORD_EXISTS"
    | "EMAIL_INVALID"
    | "DOMAIN_INVALID"
    | "HOME_INVALID"
    | "INFO_INVALID"
    | "OWNER_INVALID";

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

declare namespace Model {
  type ReviewStatus = "pending" | "approved" | "rejected";
  type SiteStatus = "open" | "closed";
  type Record = {
    id?: number;
    siteId: string;
    siteName: string;
    siteDomain: string;
    siteHome: string;
    siteOwner: string;
    siteInfo: string | null;
    siteStatus: SiteStatus;
    siteModify: Date;
    ownerEmail: string;
    reviewStatus: ReviewStatus;
    insertedAt?: Date;
    updatedAt?: Date;
  };

  type UpdateRecord = {
    siteName?: string;
    siteHome?: string;
    siteOwner?: string;
    siteInfo?: string | null;
    ownerEmail?: string;
    siteStatus?: SiteStatus;
    reviewStatus?: ReviewStatus;
  };
}

declare namespace DB {
  type Migration = {
    title: string;
    up: string;
    down: string;
  };
}

declare namespace Captcha {
  type SuccessPayload = {
    fileName: string;
    uniqueId: string;
    specialPayload: {
      type: "text";
      text: string;
    };
  };

  type Params = {
    ttlSecs?: number;
    baseParams?: {
      length?: number;
      width?: number;
      height?: number;
      darkMode?: boolean;
      complexity?: number;
      compression?: number;
    };
  };

  type Error = ErrorPayload | RemoteError;

  type ErrorPayload = {
    message: string;
    status: number;
  };

  type RemoteError = "REMOTE_ERROR";
}

declare namespace JWT {
  type SubmitOptions = {
    siteId: string;
    email: string;
  };
}
