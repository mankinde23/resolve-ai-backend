import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import healthRoutes from "./modules/health/health.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import predictionRoutes from "./modules/predictions/predictions.routes.js";
import ticketRoutes from "./modules/tickets/tickets.routes.js";
const app = express();

app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
// app.use(
//   cors({
//     origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//   }),
// );
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);
app.use(pinoHttp({ logger }));

app.use(express.json({ limit: "1mb" }));

app.use("/health", healthRoutes);

app.use("/api/v1/predictions", predictionRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
