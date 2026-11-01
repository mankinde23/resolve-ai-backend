import { z } from "zod";

export const predictionRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Ticket text cannot be empty.")
    .max(10_000, "Ticket text must not exceed 10,000 characters."),
});

export const predictionResponseSchema = z.object({
  predicted_category: z.string().min(1),
  model_version: z.string().min(1),
  confidence: z.number().min(0).max(1).nullable(),

  action: z.enum(["auto_route", "human_review", "escalate"]),

  priority: z.enum(["normal", "high"]),

  requires_human_review: z.boolean(),
  reason: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low", "undetermined"]),
  severity_reason: z.string().min(1),
  needs_more_information: z.boolean(),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;
