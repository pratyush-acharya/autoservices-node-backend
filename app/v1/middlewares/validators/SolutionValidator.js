import { body, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const solutionCreateValidation = [
  body("category").exists({ checkNull: true }).not().isEmpty().withMessage("Category Must be Present").trim().isString().withMessage("Please enter an ID as String Format"),

  body("detail").exists({ checkNull: true }).not().isEmpty().withMessage("Please Provide a proper Detail").trim().isString().withMessage("Detail must be a string."),

  body("price").exists({ checkNull: true }).not().isEmpty().withMessage("Price must be added to the price field.").isNumeric().withMessage("Price must be a number."),

  body("state").exists({ checkNull: true }).not().isEmpty().withMessage("State is a required field").isIn(["accepted", "completed", "working", "rejected", "verifying"]).withMessage("State is not supported."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendErrorResponse(res, "Validation error occurred.", errors.array());
    }
    next();
  },
];

export const solutionUpdateValidation = [
  body("category").optional().trim().isString().withMessage("Please enter an ID as String Format"),

  body("detail").optional().trim().isString().withMessage("Detail must be a string."),

  body("price").optional().isNumeric().withMessage("Price must be a number."),

  body("state").optional().isIn(["accepted", "completed", "working", "rejected", "verifying"]).withMessage("State is not supported."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendErrorResponse(res, "Validation error occurred.", errors.array());
    }
    next();
  },
];
