import { Router } from "express";
import { downloadImage, downloadQueueReport } from "../controllers/DownloadController.js";

export const router = Router();

router.route("/:folder/:name").get(downloadImage);
router.route("/queue/report/:name").get(downloadQueueReport);
