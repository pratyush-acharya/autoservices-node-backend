import {User} from '../../models/UserSchema.js';
import {check, validationResult} from 'express-validator';
import {sendErrorResponse} from "../../utils/sendResponse.js";
import {Organization} from '../../models/OrganizationSchema.js';


export const validateCreateVehicle = [
    check('number')
        .notEmpty().withMessage('Vehicle number is required'),

    check('identity_number')
        .notEmpty().withMessage('Identity number is required.')
        .isString().withMessage('Identity number must be a string'),

    check('model')
        .notEmpty().withMessage('Vehicle model is required.')
        .isString().withMessage('Vehicle model must be a string'),

    check('type')
        .notEmpty().withMessage('Vehicle type is required')
        .isIn(['organizational', 'personal']).withMessage('Unsupported value given'),

    check('user_id')
        .if(check('organization_id').notEmpty())
        .isEmpty().withMessage("Can't have both vehicle user and organization")
        .if(check('type').equals("personal"))
        .notEmpty().withMessage('Vehicle user is required for personal vehicles')
        .custom(value => {
            return User.findById(value).then(user => {
                if (!user) {
                    return Promise.reject('Invalid User Id');
                }
            });
        }),

    check('organization_id')
        .if(check('user_id').notEmpty())
        .isEmpty().withMessage("Can't have both vehicle user and organization")
        .if(check('type').equals("organizational"))
        .notEmpty().withMessage('Vehicle organization is required for organizational vehicles')
        .custom(value => {
            return Organization.findById(value).then(organization => {
                if (!organization) {
                    return Promise.reject('Invalid Organization Id');
                }
            });
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, "Validation error occurred.", errors.array())
        } else {
            next();
        }
    }
]

export const validateUpdateVehicle = [
    check( 'number')
        .optional(),

    check('type')
        .optional()
        .isIn(['organizational', 'personal']).withMessage('Unsupported value given'),

    check('user_id')
        .optional()
        .if(check('organization_id').notEmpty())
        .isEmpty().withMessage("Can't have both vehicle user and organization")
        .if(check('type').equals("personal"))
        .notEmpty().withMessage('Vehicle user is required for personal vehicles')
        .custom(value => {
            return User.findById(value).then(user => {
                if (!user) {
                    return Promise.reject('Invalid User Id');
                }
            });
        }),

    check('organization_id')
        .optional()
        .if(check('user_id').notEmpty())
        .isEmpty().withMessage("Can't have both vehicle user and organization")
        .if(check('type').equals("organizational"))
        .notEmpty().withMessage('Vehicle organization is required for organizational vehicles')
        .custom(value => {
            return Organization.findById(value).then(organization => {
                if (!organization) {
                    return Promise.reject('Invalid Organization Id');
                }
            });
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, "Validation error occurred.", errors.array())
        } else {
            next();
        }
    }

]