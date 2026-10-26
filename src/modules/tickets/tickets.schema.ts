import { z } from "zod";

export const createTicketSchema = z.object({
  text: z.string().trim().min(1).max(10_000),
});

export const listTicketsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const ticketIdSchema = z.string().uuid();

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
