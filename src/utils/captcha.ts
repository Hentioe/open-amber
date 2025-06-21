import { cache } from ".";

export function verify(siteId: string, input: string): boolean {
  const code = cache.get<string>(cache.keygen("cap", siteId));
  if (code) {
    return code.toUpperCase() === input.toUpperCase();
  }

  return false;
}
