import { cache } from ".";

export function verify(uniqueId: string, input: string): boolean {
  const code = cache.get<string>(cache.keygen("cap", uniqueId));
  if (code) {
    return code.toUpperCase() === input.toUpperCase();
  }

  return false;
}
