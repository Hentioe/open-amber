import { createPinoLogger } from "@bogeychan/elysia-logger";

export default createPinoLogger({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});
