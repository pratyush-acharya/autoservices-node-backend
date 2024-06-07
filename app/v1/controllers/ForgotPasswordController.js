import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse.js";
import { logger } from "../utils/logger.js";
import { User } from "../models/UserSchema.js";
import { OTPModel } from "../models/OTPSchema.js";
import { transport as mailer } from "../utils/mailer.js";
import { setMailOptionsAdmin } from "../services/MailService.js";

export const forgotPassword = async (req, res, next) => {
  const phoneNumber = req.body.phone_number;
  try {
    const user = await User.findOne({ phone_number: phoneNumber });
    if (user) {
      next();
    } else {
      return sendErrorResponse(res, "User does not exist.", {}, 400);
    }
  } catch (err) {
    logger.error(err.message);
    return sendErrorResponse(res, "Some error occured.");
  }
};

export const changePassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const otp = await OTPModel.findOne({
      phone_number: req.body.phone_number,
      otp: req.body.otp,
      is_used: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!otp) {
      return sendErrorResponse(res, "OTP is invalid or expired.");
    }

    if (otp) {
      let newPassword = await bcrypt.hash(req.body.password, 10);
      var user = await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { password: newPassword });
      await otp.utilized();
    } else {
      throw new Error("OTP is invalid.");
    }

    await session.commitTransaction();
    await session.endSession();

    return sendSuccessResponse(res, "Password changed successfully.");
  } catch (err) {
    logger.error(err.message);
    await session.abortTransaction();
    await session.endSession();
    return sendErrorResponse(res, "Some error occured. " + err.message);
  }
};

export const adminForgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ phone_number: req.body.phone_number });
    if (user) {
      if (!user.roles.includes("admin")) {
        return sendErrorResponse(res, "Unauthorized.", {}, 401);
      }
      const token = jwt.sign(
        {
          sub: user._id,
          phone_number: user.phone_number,
          roles: user.roles,
          iat: Math.floor(Date.now() / 1000) - 30,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const link = `${process.env.BASE_URL}/api/v1/forgot-password/admin/change/${token}`;
      await mailer.sendMail(setMailOptionsAdmin(user.email, link, user.phone_number));
      return sendSuccessResponse(res, "Change password email has been sent to registered email.");
    } else {
      return sendErrorResponse(res, "There is no user registered under this number.", err.message);
    }
  } catch (err) {
    logger.error(err.message);
    return sendErrorResponse(res, "Failed to send change password email.", err.message);
  }
};
export const adminChangePassword = async (req, res) => {
  console.log(req.body);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const token = req.body.token;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userPayload) => {
      if (err) return sendErrorResponse(res, "Invalid token.", { err }, 401);
      try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        await User.findByIdAndUpdate(userPayload.sub, { password: newPassword }, { new: true });
      } catch (error) {
        logger.error("Error occured while updating password: " + error.message);
        return sendErrorResponse(res, "User not found.", { err }, 401);
      }
    });

    await session.commitTransaction();
    await session.endSession();

    return sendSuccessResponse(res, "Password changed successfully.");
  } catch (err) {
    logger.error(err.message);
    await session.abortTransaction();
    await session.endSession();
    return sendErrorResponse(res, "Some error occured. " + err.message);
  }
};
