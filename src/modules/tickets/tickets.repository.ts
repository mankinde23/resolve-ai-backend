import { prisma } from "../../config/database.js";

export interface CreateTicketRecord {
  text: string;
  predictedCategory: string;
  modelVersion: string;
  confidence: number | null;
  action: "auto_route" | "human_review" | "escalate";
  priority: "normal" | "high";
  requiresHumanReview: boolean;
  reason: string;
  severity: "critical" | "high" | "medium" | "low" | "undetermined";
  severityReason: string;
  needsMoreInformation: boolean;
}

export interface ListTicketsOptions {
  limit: number;
  offset: number;
}

export const ticketsRepository = {
  create(data: CreateTicketRecord) {
    return prisma.ticket.create({ data });
  },

  findMany({ limit, offset }: ListTicketsOptions) {
    return prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  },

  count() {
    return prisma.ticket.count();
  },

  findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
    });
  },
};
