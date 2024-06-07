import {Router} from "express";
import {
    forgotPassword,
    changePassword,
    adminForgotPassword,
    adminChangePassword
} from "../controllers/ForgotPasswordController.js";
import {
    generateOtp,
    sendOtp
} from "../controllers/OTPController.js";
import {
    changePasswordValidation,
    adminChangePasswordValidation
} from "../middlewares/validators/ChangePasswordValidator.js";

export const router = Router();

router.route('/')
    .post(forgotPassword, generateOtp, sendOtp);

router.route('/otp/verify')
    .post(changePasswordValidation, changePassword);
    
router.route('/admin')
    .post(adminForgotPassword);

router.route('/admin/change')
    .post(adminChangePasswordValidation, adminChangePassword);