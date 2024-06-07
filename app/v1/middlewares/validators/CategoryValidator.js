import {body, validationResult} from "express-validator";
import {sendErrorResponse} from "../../utils/sendResponse.js";

export const createCategoryValidator = [
    body('name')
        .exists({checkNull: true}).withMessage("Name is a required field.")
        .not().isEmpty().withMessage("Name is a required field.")
        .trim().isString()
        .withMessage("Name must be a String."),

    body('description')
        .notEmpty().withMessage("Description is a required field")
        .exists({checkNull: true}).withMessage("Description is a required field")
        .trim().isString().withMessage("Description is of type string. "),

    (req, res, next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            sendErrorResponse(res, "Validation error occurred.", errors.array())
        }
        next()
    }
]

export const updateCategoryValidator = [
    body('name')
        .optional()
        .trim().isString()
        .withMessage("Name must be a String."),

    body('description')
        .optional().trim().isString().withMessage("Description is of type string. "),

    (req, res, next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            sendErrorResponse(res, "Validation error occurred.", errors.array())
        }
        next()
    }

]

