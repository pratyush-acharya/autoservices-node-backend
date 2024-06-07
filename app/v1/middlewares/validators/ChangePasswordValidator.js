import {User} from '../../models/UserSchema.js';
import {body, validationResult} from "express-validator";
import {sendErrorResponse} from "../../utils/sendResponse.js";


export const changePasswordValidation = [
    body('phone_number')
        .exists({checkNull: true})
        .trim()
        .custom(async value => {
            return User.find({phone_number: value}).then(user => {
                if (user.length == 0) {
                    return Promise.reject("Phone Number not registered");
                }
            });
        }).withMessage("Phone Number not registered"),

    body('password')
        .exists({checkNull: true})
        .isLength({min: 8})
        .withMessage("Password must be 8 characters long.")
        .matches("(?=.*[0-9])+")
        .withMessage("Password must contain atleast one digit")
        .matches("(?=.*[a-z])+")
        .withMessage("Password must contain atleast one lowercase letter")
        .matches("(?=.*[A-Z])+")
        .withMessage("Password must contain atleast one uppercase letter")
        .matches("(?=.*[-+_!@#$%^&*.,?])+")
        .withMessage("Password must contain atleast one special character"),

    body('otp')
        .exists({checkNull: true}),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, "Validation error occurred.", errors.array())
        }
        next()
    }
]

export const adminChangePasswordValidation = [
    body('password')
        .exists({checkNull: true})
        .isLength({min: 8})
        .withMessage("Password must be 8 characters long.")
        .matches("(?=.*[0-9])+")
        .withMessage("Password must contain atleast one digit")
        .matches("(?=.*[a-z])+")
        .withMessage("Password must contain atleast one lowercase letter")
        .matches("(?=.*[A-Z])+")
        .withMessage("Password must contain atleast one uppercase letter")
        .matches("(?=.*[-+_!@#$%^&*.,?])+")
        .withMessage("Password must contain atleast one special character"),

    body('token')
        .exists({checkNull: true}),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, "Validation error occurred.", errors.array())
        }
        next()
    }
]