import { body, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";
import { Organization } from "../../models/OrganizationSchema.js";

export const organizationCreateValidation = [
  body("name")
    .notEmpty()
    .trim()
    .isString()
    .withMessage("Name Field is required")
    .custom(async (value) => {
      return Organization.find({ name: value }).then((organization) => {
        if (organization.length != 0) {
          return Promise.reject("Phone Number already Registered");
        }
      });
    })
    .withMessage("Name already registered"),

  body("contracts").notEmpty().withMessage("Contract field is Required"),

  body("contracts.*.end_date").notEmpty().trim().isDate().withMessage("Must be a valid date."),

  body("contracts.*.start_date").notEmpty().trim().isDate().withMessage("Must be a valid date."),

  body("users").optional().trim().isString().withMessage("Users ID must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, "Validation error occurred.", errors.array());
    }
    next();
  },
];

export const organizationUpdateValidation = [
  body("name").optional().trim().isString().withMessage("Name Field is required"),

  body("users").optional().trim().isString().withMessage("Users ID must be a string"),

  body("contracts.*.end_date").if(body("contracts").notEmpty()).notEmpty().trim().isDate().withMessage("Must be a valid date."),

  body("contracts.*.start_date").if(body("contracts").notEmpty()).notEmpty().trim().isDate().withMessage("Must be a valid date."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, "Validation error occurred.", errors.array());
    }
    next();
  },
];
