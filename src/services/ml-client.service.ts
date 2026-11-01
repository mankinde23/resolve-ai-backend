import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { ApiError } from "../lib/api-error.js";
import {
  predictionResponseSchema,
  type PredictionResponse,
} from "../modules/predictions/predictions.schema.js";

// interface MlPredictionResponse {
//   predicted_category: string;
//   model_version: string;
//   confidence: number | null;
//   action: "auto_route" | "human_review" | "escalate";
//   priority: "normal" | "high";
//   requires_human_review: boolean;
//   reason: string;
// }

export async function predictTicket(text: string): Promise<PredictionResponse> {
  let response: Response;

  try {
    response = await fetch(`${env.ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(env.ML_SERVICE_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";

    logger.warn({ timedOut, err: error }, "ML service request failed");

    throw new ApiError(
      timedOut ? 504 : 503,
      timedOut ? "ML_SERVICE_TIMEOUT" : "ML_SERVICE_UNAVAILABLE",
      timedOut
        ? "The prediction service took too long to respond."
        : "The prediction service is currently unavailable.",
    );
  }

  if (!response.ok) {
    // Do not forward internal Python error details to API consumers.
    logger.warn(
      { status: response.status },
      "ML service returned a non-success response",
    );

    throw new ApiError(
      502,
      "ML_SERVICE_ERROR",
      "The prediction service could not process the ticket.",
    );
  }

  let body: unknown;

  try {
    // body = (await response.json()) as MlPredictionResponse;
    body = await response.json();
  } catch {
    throw new ApiError(
      502,
      "INVALID_ML_RESPONSE",
      "The prediction service returned an invalid response.",
    );
  }

  const parsed = predictionResponseSchema.safeParse(body);

  if (!parsed.success) {
    logger.error(
      { issues: parsed.error.issues },
      "ML service response did not match the expected schema",
    );

    throw new ApiError(
      502,
      "INVALID_ML_RESPONSE",
      "The prediction service returned an invalid response.",
    );
  }

  return parsed.data;
}
