import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Resolve AI backend started");
});

function shutdown(signal: string): void {
  logger.info({ signal }, "Shutting down server");

  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "Server shutdown failed");
      process.exitCode = 1;
      return;
    }

    logger.info("Server closed successfully");
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
