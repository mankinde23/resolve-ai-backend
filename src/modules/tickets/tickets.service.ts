import { ApiError } from "../../lib/api-error.js";
import { classifyTicket } from "../predictions/predictions.service.js";
import { ticketsRepository } from "./tickets.repository.js";

export const ticketsService = {
  async create(text: string) {
    // Classify and obtain the triage decision first.
    const prediction = await classifyTicket(text);

    return ticketsRepository.create({
      text,
      predictedCategory: prediction.predicted_category,
      modelVersion: prediction.model_version,
      confidence: prediction.confidence ?? null,
      action: prediction.action,
      priority: prediction.priority,
      requiresHumanReview: prediction.requires_human_review,
      reason: prediction.reason,
      severity: prediction.severity,
      severityReason: prediction.severity_reason,
      needsMoreInformation: prediction.needs_more_information,
    });
  },

  async list(limit: number, offset: number) {
    const [items, total] = await Promise.all([
      ticketsRepository.findMany({ limit, offset }),
      ticketsRepository.count(),
    ]);

    return {
      items,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + items.length < total,
      },
    };
  },

  async getById(id: string) {
    const ticket = await ticketsRepository.findById(id);

    if (!ticket) {
      throw new ApiError(404, "TICKET_NOT_FOUND", "Ticket not found.");
    }

    return ticket;
  },
};
