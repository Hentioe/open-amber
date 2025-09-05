declare namespace Captcha {
  type Generated = {
    workingMode: "hosted" | "localized";
    namespace: string;
    fileName: string;
    uniqueId: string;
    specialPayload: {
      type: "classic";
      text: string;
    };
  };

  type GenerateParams = {
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

  type VerfyParams = {
    uniqueId: string;
    answer: {
      text: string;
      ignoreCase?: boolean;
    };
  };

  type VerifyResult = {
    ok: boolean;
  };

  type Error = ErrorPayload | RemoteError;

  type ErrorPayload = {
    message: string;
    status: number;
  };

  type RemoteError = "REMOTE_ERROR";
}
