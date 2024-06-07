import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";

export const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.roles) {
            return sendErrorResponse(res, "Please log in again.", {}, 401);
        }
        const rolesArray = [...allowedRoles];
        const result = req.user.roles
                        .map(
                            role => rolesArray.includes(role)
                        ).find(
                            val => val === true
                        );
        if (!result) {
            return sendErrorResponse(res, "Unauthorized role.", {}, 403);
        }
        next();
    }
}