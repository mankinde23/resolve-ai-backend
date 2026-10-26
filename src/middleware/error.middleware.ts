import type { ErrorRequestHandler } from "express";
import { logger } from "../config/logger.js";
import { ApiError } from "../lib/api-error.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  logger.error(
    { err, method: req.method, url: req.originalUrl },
    "Unhandled request error",
  );

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};
