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
  confidence: z.number().min(0).max(1).nullable().optional(),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;
