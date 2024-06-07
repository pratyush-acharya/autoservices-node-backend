import {
    sendSuccessResponse,
    sendErrorResponse,
} from "../utils/sendResponse.js";
import { logger } from "../utils/logger.js";
import { User } from '../models/UserSchema.js';

export const handleLogout = async (req, res) => {
    try{
        const cookies = req.cookies;
        if (!cookies?.refreshToken){
            return sendErrorResponse(res, "You are not logged in.");
        }
        const refreshToken = cookies.refreshToken;
        
        let user = await User.findOne({'refreshToken': refreshToken});
        
        if (!user) {
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
            return sendErrorResponse(res, "You are not logged in.")
        }
        
        // Delete refreshToken in db
        user = await User.findByIdAndUpdate(
            {_id:user._id},
            { refreshToken: ""},
            {
                new: true,
                runValidators: true
            }
            );
            
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
            return sendSuccessResponse(res, "Successfully logged out.", {}, 200)
    }catch (err) {
            logger.error("Logout Failed: " + err.message)
            return sendErrorResponse(res, "Logout failed: ", err.message)
    }
}