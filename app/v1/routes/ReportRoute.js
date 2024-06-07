import { Router } from "express";
import { generateMonthlyData } from "../controllers/ReportController.js";
import { generateQueueData } from "../controllers/ReportController.js";

export const router = Router();

router.post("/generate/queue", generateQueueData);
router.post("/generate/monthly", generateMonthlyData);
