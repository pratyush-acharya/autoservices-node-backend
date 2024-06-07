import { User } from "../../models/UserSchema.js";
import { body, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

const validRoles = ["admin", "user", "mechanic", "receptionist"];

export const userCreateValidation = [
  body("name").notEmpty().withMessage("Name is a Required Field.").trim().isString(),

  body("phone_number")
    .exists({ checkNull: true })
    .withMessage("Phone Number is required")
    .trim()
    .isInt()
    .withMessage("Phone number must be a number")
    .isLength({
      min: 7,
      max: 10,
    })
    .withMessage("Phone must be between :min to :max Characters.")
    .custom(async (value) => {
      return User.find({ phone_number: value }).then((user) => {
        if (user.length != 0) {
          return Promise.reject("Phone Number already Registered");
        }
      });
    })
    .withMessage("Phone Number already Registered"),

  body("email")
    .exists({ checkNull: true })
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value) => {
      return User.find({ email: value }).then((user) => {
        if (user.length != 0) {
          return Promise.reject("Email already Registered");
        }
      });
    })
    .withMessage("Email already Registered"),

  body("type").notEmpty().withMessage("Type is Required").trim().isIn(["organizational", "personal"]).withMessage("Only organizational or personal allowed."),

  body("roles")
    .notEmpty()
    .withMessage("User role is required")
    .custom(async (value) => {
      value = JSON.parse(value);
      try {
        for (const role of value) {
          if (typeof role !== "string") {
            throw new Error(`Role ${role} must be a string`);
          }
          if (!validRoles.includes(role)) {
            throw new Error(`Role ${role} is not allowed`);
          }
        }
        return true;
      } catch {
        throw new Error(`Role ${role} is not allowed`);
      }
    })
    .withMessage("Invalid role"),

  body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password must have atleast 8 characters.")
    .matches("(?=.*[0-9])+")
    .withMessage("Password must contain atleast one digit")
    .matches("(?=.*[a-z])+")
    .withMessage("Password must contain atleast one lowercase letter")
    .matches("(?=.*[A-Z])+")
    .withMessage("Password must contain atleast one uppercase letter")
    .matches("(?=.*[-+_!@#$%^&*.,?])+")
    .withMessage("Password must contain atleast one special character"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, "Validation error occurred.", errors.array());
    }
    console.log("ALL VALIDATION PASSED");
    next();
  },
];

/**
 * This middleware validates data while updating existing user.
 *
 * @return next()
 */

export const userUpdateValidation = [
  body("name").optional().trim().isString().withMessage("Name must be a String."),

  body("phone_number")
    .optional()
    .trim()
    .isInt()
    .withMessage("Phone number must be a number")
    .isLength({
      min: 7,
      max: 10,
    })
    .withMessage("Phone must be between :min to :max Characters.")
    .custom(async (value, { req }) => {
      const userId = req.params.id;
      return User.findOne({ phone_number: value }).then((user) => {
        if (user && user._id != userId) {
          return Promise.reject();
        }
        return true;
      });
    })
    .withMessage("Phone Number already Registered"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      const userId = req.params.id;
      return User.findOne({ email: value }).then((user) => {
        if (user && user._id != userId) {
          return Promise.reject();
        }
        return true;
      });
    })
    .withMessage("Email already registered."),

  body("type").optional().trim().isIn(["organizational", "personal"]).withMessage("Only  organizational or personal allowed."),

  body("roles")
    .optional()
    .custom(async (value) => {
      value = JSON.parse(value);

      try {
        for (const role of value) {
          if (typeof role !== "string") {
            throw new Error(`Role ${role} must be a string`);
          }
          if (!validRoles.includes(role)) {
            throw new Error(`Role ${role} is not allowed`);
          }
        }
        return true;
      } catch {
        throw new Error(`Role ${role} is not allowed`);
      }
    })
    .withMessage("Invalid role"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters long.")
    .matches("(?=.*[0-9])+")
    .withMessage("Password must contain atleast one digit")
    .matches("(?=.*[a-z])+")
    .withMessage("Password must contain atleast one lowercase letter")
    .matches("(?=.*[A-Z])+")
    .withMessage("Password must contain atleast one uppercase letter")
    .matches("(?=.*[-+_!@#$%^&*.,?])+")
    .withMessage("Password must contain atleast one special character"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, "Validation error occurred.", errors.array());
    }
    next();
  },
];
