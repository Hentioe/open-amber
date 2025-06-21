export function success<T>(payload: T): Api.Success<T> {
  return {
    success: true,
    payload: payload,
  };
}

export function failure(
  message: string,
  { reason, payload }: { reason?: Api.ErrorReason; payload?: unknown } = {},
): Api.Error {
  return {
    success: false,
    message,
    reason,
    payload,
  };
}
