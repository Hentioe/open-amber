const PORT = envVar("OPEN_AMBER_PORT", { fallback: "3000" })!;
const CAPTCHA_TTL = envVar("OPEN_AMBER_CAPTCHA_TTL", { fallback: "300" })!; // 默认 5 分钟
const CAPTCHA_COMPLEXITY = envVar("OPEN_AMBER_CAPTCHA_COMPLEXITY", { fallback: "5" })!; // 默认难度 5

const vars = {
  PORT: parseInt(PORT),
  BASE_URL: envVar("OPEN_AMBER_BASE_URL", { fallback: fallbackBaseUrl() })!,
  CAPTCHA_TTL: parseInt(CAPTCHA_TTL),
  CAPTCHA_COMPLEXITY: parseInt(CAPTCHA_COMPLEXITY),
  VERIFY_SECRET: envVar("OPEN_AMBER_VERIFY_SECRET", { enforce: true })!,
  REVIEW_SECRET: envVar("OPEN_AMBER_REVIEW_SECRET", { enforce: true })!,
  ENCRYPTION_KEY: envVar("OPEN_AMBER_ENCRYPTION_KEY", { enforce: true })!,
  ADMIN_API_KEY: envVar("OPEN_AMBER_ADMIN_API_KEY", { enforce: true })!,
  CAPINDE_BASE_URL: envVar("OPEN_AMBER_CAPINDE_BASE_URL", { fallback: fallbackCapindeBaseUrl() })!,
  CAPINDE_API_KEY: envVar("OPEN_AMBER_CAPINDE_API_KEY", { enforce: false })!,
  RESEND_API_KEY: envVar("OPEN_AMBER_RESEND_API_KEY", { enforce: true })!,
  RESEND_SENDER: envVar("OPEN_AMBER_RESEND_SENDER", { fallback: "onboarding@resend.dev" })!,
};

function fallbackBaseUrl(env = process.env.NODE_ENV): string {
  return env === "production" ? `http://localhost:${PORT}` : "http://localhost:4000";
}

function fallbackCapindeBaseUrl(env = process.env.NODE_ENV): string {
  return env === "production" ? `http://capinde:8080` : "http://localhost:8080";
}

function envVar(key: string, { fallback, enforce = false }: { fallback?: string; enforce?: boolean }) {
  const value = process.env[key] || fallback;
  if (value !== undefined && value !== null && value !== "") {
    return value;
  } else if (enforce) {
    throw new Error(`Environment variable \`${key}\` is required but not set`);
  }

  return undefined;
}

export default vars;
