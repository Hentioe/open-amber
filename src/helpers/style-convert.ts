import camelcaseKeys from "camelcase-keys";

type CamelCaseRecord = Record<string, unknown>;

export function strictify<T>(result: unknown): T {
  if (Array.isArray(result)) {
    return result.map(item => camelcaseKeys(item as CamelCaseRecord)) as T;
  } else if (result) {
    return camelcaseKeys(result as CamelCaseRecord) as T;
  }

  return result as T;
}
