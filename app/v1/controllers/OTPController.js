import {User} from "../models/UserSchema.js";
import {OTPModel} from "../models/OTPSchema.js";
import {transport as mailer} from "../utils/mailer.js";
import {setMailOptions} from "../services/MailService.js";
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";
import {logger} from "../utils/logger.js";

export const generateOtp = async (req, res, next) => {
    const phoneNumber = req.body.phone_number
    const otp = Math.floor(1000 + Math.random() * 8999);
    const user = await User.findOne({phone_number: phoneNumber})
    try {
        const otpObject = new OTPModel({phone_number: phoneNumber, otp: otp, user: user._id})
        await otpObject.save()
        req.body.otp = otpObject;
        next()
    } catch (err) {
        logger.error(err.message)
        return sendErrorResponse(res, "OTP cannot be generated." + err.message)
    }
}

export const sendOtp = async (req, res) => {
    const otp = req.body.otp;
    try {
        await mailer.sendMail(setMailOptions(otp.otp, otp.phone_number));
        return sendSuccessResponse(res, "OTP has been sent.");
    } catch (err) {
        logger.error(err.message)
        return sendErrorResponse(res, "Failed to send OTP.: " + err.message );
    }
}