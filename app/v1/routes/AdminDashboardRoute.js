import {Router} from "express";
import { index } from "../controllers/DashboardController.js";

export const router = Router();
router.route('/').get(index)