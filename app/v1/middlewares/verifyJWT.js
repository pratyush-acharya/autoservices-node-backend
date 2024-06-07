import jwt from 'jsonwebtoken';
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";
import { logger } from "../utils/logger.js";
import { User } from '../models/UserSchema.js';

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')){
        return sendErrorResponse(res, "Unauthorized.", {}, 401);
    }
    
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, userPayload) => {
            if (err) return sendErrorResponse(res, "Invalid token.", {err}, 401);
            try {
                const user = await User.findById(userPayload.sub);
                req.user = user;
                if(user.refreshToken == ""){
                    return sendErrorResponse(res, "Please log in again.", {}, 401);
                }
                next();
            } catch (error) {
                logger.error("Error occured while verifying token: " + error.message);
                return sendErrorResponse(res, "Please log in again.", {err}, 401);
            }
        }
    );
}