import * as Sentry from "@sentry/bun";
import log from "./log";

const sentryDsn = process.env["OPEN_AMBER_SENTRY_DSN"];

if (sentryDsn) {
  // Ensure to call this before importing any other modules!
  Sentry.init({
    dsn: sentryDsn,

    // Add Performance Monitoring by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  log.info("Sentry initialized");
}
