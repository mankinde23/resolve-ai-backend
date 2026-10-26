import type { Request, Response } from "express";
import { ticketsService } from "./tickets.service.js";
import {
  createTicketSchema,
  listTicketsSchema,
  ticketIdSchema,
} from "./tickets.schema.js";

export async function createTicket(req: Request, res: Response) {
  const input = createTicketSchema.parse(req.body);
  const ticket = await ticketsService.create(input.text);

  res.status(201).json({ data: ticket });
}

export async function listTickets(req: Request, res: Response) {
  const query = listTicketsSchema.parse(req.query);
  const result = await ticketsService.list(query.limit, query.offset);

  res.status(200).json({ data: result });
}

export async function getTicket(req: Request, res: Response) {
  const id = ticketIdSchema.parse(req.params.id);
  const ticket = await ticketsService.getById(id);

  res.status(200).json({ data: ticket });
}
