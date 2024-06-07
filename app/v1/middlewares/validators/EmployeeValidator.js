import {body, validationResult} from "express-validator";

export const createEmployeeValidator = [
    body('name')
        .exists().trim().notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be at least 3 characters long')
        .isLength({
            max: 100,
            min: 3
        }).withMessage('Name must be at least 3 to 100 characters long'),

    body('designation')
        .exists().trim().notEmpty().withMessage('Designation is required')
        .isString().withMessage('Name must be at least 3 characters long')
        .isLength({
            max: 100,
            min: 3
        }).withMessage('Designation must be at least 3 to 100 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        next();
    }
]

export const updateEmployeeValidator = [
    body('name')
        .optional().trim().notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be at least 3 characters long')
        .isLength({
            max: 100,
            min: 3
        }).withMessage('Name must be at least 3 to 100 characters long'),


    body('designation')
        .optional().trim().notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be at least 3 characters long')
        .isLength({
            max: 100,
            min: 3
        }).withMessage('Name must be at least 3 to 100 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        next();
    }
]