import {Router} from "express";
import {
    generateOtp,
    sendOtp
} from "../controllers/OTPController.js";
import {
    attemptLogin,
    getNewAccessToken,
    checkAccessToken
} from "../controllers/AuthController.js";
import {
    registerUser,
    verifyUser
} from "../controllers/RegisterController.js";


export const router = Router();

router.route('/register')
    .post(registerUser, generateOtp, sendOtp)

router.route('/otp/verify')
    .post(verifyUser)

router.route('/')
    .post(attemptLogin)

router.route('/getAccessToken')
    .post(getNewAccessToken)

router.route('/checkAccessToken')
    .post(checkAccessToken)