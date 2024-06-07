import {User} from '../models/UserSchema.js';
import {OTPModel} from "../models/OTPSchema.js";
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";
import {logger} from "../utils/logger.js";
import path from "path";
import {isAcceptedImageFile, uploadImage} from "../utils/imageUpload.js";
import mongoose from "mongoose";

const storeUser = async (req, res, next) => {
    try {
        if(req.files){
            const user = new User(req.body)
            let filename = req.files.avatar.name;
            //checking image filetype
            const file_extension = path.extname(filename);
            if (!isAcceptedImageFile(file_extension)) {
                return sendErrorResponse(res,  "Please use one of the accepted filetypes: .png, .jpeg, .jpg")
            }
            //renaming and saving new profile picture
            filename = `${Date.now()}${file_extension}`;
            let dir = path.join(appRoot, '/storage/profile_pics');
            await uploadImage(req.files.avatar, dir, filename);

            user.avatar = filename;
            await user.save()
            next()
        }else {
            throw new Error("User profile picture missing.")
        }
    } catch (err) {
        logger.error(err.message)
        return sendErrorResponse(res, "Registration unsuccessful.")
    }
}

export const registerUser = async (req, res, next) => {
    const phoneNumber = req.body.phone_number
    try {
        const user = await User.findOne({phone_number: phoneNumber})
        if (user) {
            if (user.is_verified) {
                return sendErrorResponse(res, "User is already registered.")
            }
            next()
        }

        await storeUser(req, res, next)
    } catch (err) {
        logger.error(err.message)
        return sendErrorResponse(res, "User cannot be created.");
    }
}

export const verifyUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const otp = await OTPModel.findOne({
            phone_number: req.body.phone_number,
            is_used: false,
            expiresAt: { $gt: Date.now() }
        })

        if (!otp) {
            return sendErrorResponse(res, "OTP is invalid or expired.")
        }

        if (otp.otp == req.body.otp){
            let user = await User.findOne({phone_number: req.body.phone_number}, {is_verified: 1})
            await user.verify()
            await otp.utilized()
        } else {
            throw new Error("OTP is invalid.")
        }

        await session.commitTransaction();
        await session.endSession();

        return sendSuccessResponse(res, "User verified.");
    } catch (err) {
        logger.error(err.message)
        await session.abortTransaction();
        await session.endSession();
        return sendErrorResponse(res, "User cannot be verified.")
    }
}