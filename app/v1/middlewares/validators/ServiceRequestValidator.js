import {sendErrorResponse} from "../../utils/sendResponse.js";
import {body, validationResult, check} from "express-validator";

export const serviceRequestValidation = [
    body('user')
        .exists({checkNull: true})
        .trim().notEmpty()
        .withMessage("Must be associated with some user.")
        .isString(),

    body('issues.*')
        .exists({checkNull: true})
        .trim().notEmpty()
        .withMessage("Must be a string.")
        .isString()
        .withMessage("Issues are required fields."),

    body('vehicle_id')
        .exists({checkNull: true})
        .trim().notEmpty().withMessage("Vehicle id is a required parameter.")
        .isString().withMessage("Vehicle id must be a string."),

    body("is_pickup")
        .exists({checkNull: true})
        .isBoolean()
        .withMessage("Is pickup is a required field."),

    body("is_dropoff")
        .exists({checkNull: true})
        .isBoolean()
        .withMessage("Is pickup is a required field."),

    body('pickup_detail.street')
        .if(body("is_pickup").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Street name must be a string."),

    body('pickup_detail.ward')
        .if(body("is_pickup").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Ward name must be a string."),

    body('pickup_detail.locality')
        .if(body("is_pickup").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Locality name must be a string."),

    body('dropoff_detail.street')
        .if(body("is_dropoff").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Street name must be a string."),

    body('dropoff_detail.ward')
        .if(body("is_dropoff").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Ward name must be a string."),

    body('dropoff_detail.locality')
        .if(body("is_dropoff").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Locality name must be a string."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return sendErrorResponse(res, "Validation Error Occurred", errors.array())

        next()
    }
]

export const serviceRequestUpdateValidation = [
    body('user')
        .optional()
        .trim()
        .isString(),

    body('issues.*')
        .optional()
        .trim()
        .isString()
        .withMessage("Must be a string."),

    body('vehicle_id')
        .optional()
        .trim()
        .isString()
        .withMessage("Vehicle id must be a string."),

    body("is_pickup")
        .optional()
        .isBoolean()
        .withMessage("Is pickup is a required field."),

    body("is_dropoff")
        .optional()
        .isBoolean()
        .withMessage("Is pickup is a required field."),

    body('pickup_detail.street')
        .optional()
        .if(body("is_pickup").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Street name must be a string."),

    body('pickup_detail.ward')
        .optional()
        .if(body("is_pickup").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Ward name must be a string."),

    body('pickup_detail.locality')
        .optional()
        .if(body("is_pickup").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Locality name must be a string."),

    body('dropoff_detail.street')
        .optional()
        .if(body("is_dropoff").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Street name must be a string."),

    body('dropoff_detail.ward')
        .optional()
        .if(body("is_dropoff").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Ward name must be a string."),

    body('dropoff_detail.locality')
        .optional()
        .if(body("is_dropoff").matches('true'))
        .exists().notEmpty().withMessage("Cannot be Empty")
        .isString().withMessage("Locality name must be a string."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return sendErrorResponse(res, "Validation Error Occurred", errors.array())

        next()
    }
]