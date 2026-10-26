import { Router } from "express";
import { createTicket, getTicket, listTickets } from "./tickets.controller.js";

const router = Router();

router.post("/", createTicket);
router.get("/", listTickets);
router.get("/:id", getTicket);

export default router;
