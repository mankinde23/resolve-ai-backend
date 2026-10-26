import type { Request, Response } from "express";
import { predictionRequestSchema } from "./predictions.schema.js";
import { classifyTicket } from "./predictions.service.js";

export async function createPrediction(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = predictionRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Please provide valid ticket text.",
        details: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  const prediction = await classifyTicket(parsed.data.text);

  res.status(200).json({
    data: prediction,
  });
}
