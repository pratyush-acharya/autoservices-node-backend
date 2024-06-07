import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/sendResponse.js";
import { logger } from "../utils/logger.js";
import { User } from "../models/UserSchema.js";
import { Token } from "../models/TokenSchema.js";

export const attemptLogin = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      return sendErrorResponse(res, "Please provide phone_number and password.");
    }

    const user = await User.findOne({ phone_number: phone_number }, { password: 1, phone_number: 1 });
    if (!user) {
      return sendErrorResponse(res, "User not found with given phone number.", {}, 401);
    }

    const validPassword = await user.comparePasswords(password);

    if (validPassword) {
      const accessToken = generateAccessToken(generatePayload(user));
      const refreshToken = generateRefreshToken(generatePayload(user));
      try {
        await Token.create({ token: refreshToken, user_id: user._id });
        await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({
          user: user,
          accessToken: accessToken,
        });
      } catch (err) {
        logger.error("Error occured while setting tokens: " + err.message);
        return sendErrorResponse(res, "Something went wrong.", {}, 401);
      }
    } else {
      return sendErrorResponse(res, "Invalid phone number or password.", {}, 401);
    }
  } catch (err) {
    logger.error("Some error occurred while attempting the Login: " + err.message);
    return sendErrorResponse(res, err.message || "Some error occurred while attempting the Login.", {}, 500);
  }
};

export const getNewAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken == null) {
    return sendErrorResponse(res, "Refresh token not found.", {}, 401);
  }
  try {
    const token = await Token.findOne({ token: refreshToken });
    if (!token) {
      return sendErrorResponse(res, "Refresh token not found.", {}, 401);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return sendErrorResponse(res, "Refresh token expired.", {}, 401);
      }
      if (user.sub != token.user_id) {
        return sendErrorResponse(res, "Invalid refresh token.", {}, 401);
      }
      const accessToken = generateAccessToken(generatePayload(user));
      res.json({ accessToken: accessToken });
    });
  } catch (err) {
    logger.error("Some error occurred while attempting the Login: " + err.message);
    return sendErrorResponse(res, "Some error occurred while attempting the Login.", {}, 500);
  }
};

function generatePayload(user) {
  return {
    sub: user._id,
    phone_number: user.phone_number,
    roles: user.roles,
    iat: Math.floor(Date.now() / 1000) - 30,
  };
}

function generateAccessToken(payload) {
  // Note: expires after 15 mins
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

function generateRefreshToken(payload) {
  // Note: expires after 15 days
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
}

export const checkAccessToken = async (req, res) => {
  const token = req.body.accessToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userPayload) => {
    if (err) return false;
    try {
      const user = await User.findById(userPayload.sub);
      req.user = user;
      if (user.refreshToken == "") {
        return false;
      }
      return true;
    } catch (error) {
      logger.error("Error occured while verifying token: " + error.message);
      return false;
    }
  });
};
