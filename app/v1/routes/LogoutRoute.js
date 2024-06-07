import {Router} from "express";
import {
    handleLogout
} from "../controllers/LogoutController.js";

export const router = Router();
router.route('/').get(handleLogout);