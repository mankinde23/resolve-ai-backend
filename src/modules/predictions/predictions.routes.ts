import { Router } from "express";
import { createPrediction } from "./predictions.controller.js";

const router = Router();

router.post("/", createPrediction);

export default router;
