import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

/**
 * @desc This is the user Schema Object used to Create a User Model
 *
 * @return Schema
 */
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "You Must enter a Name"],
    maxLength: [50, "User name cannot exceed 50 characters"],
    minLength: [2, "User name should be at least 2 characters Long."],
  },

  phone_number: {
    type: String,
    required: [true, "Phone Number is a required parameter."],
    minLength: [7, "Phone Number should be of 7 to 10 characters."],
    maxLength: [10, "Phone Number should be of 7 to 10 characters."],
    unique: [true, "Phone Number already Registered"],
  },

  email: {
    type: String,
    required: [true, "Email is a required parameter."],
    unique: [true, "Email already registered."],
  },

  avatar: {
    type: String,
    required: [true, "Profile picture is required."],
  },

  is_verified: {
    type: Boolean,
    optional: true,
    default: false,
  },

  type: {
    type: String,
    required: true,
    enum: ["organizational", "personal"],
  },

  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password must be at least 8 Characters."],
  },

  roles: {
    type: [String],
    enum: ["admin", "user", "mechanic", "receptionist"],
    required: [true, "Please select a role"],
  },

  created_at: {
    type: Date,
    default: Date.now,
    optional: true,
  },

  refreshToken: String,
});

// function to change the password
userSchema.methods.changePassword = async function (password) {
  this.password = password;
  await this.save();
};

/**
 * This function hash the password before saving to the database.
 *
 * @return next()
 */
userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * This function can be used in user objects in order to compare the passwords.
 *
 * @param password
 * @returns {Promise<void|*>}
 */
userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * This function can be used in order to set verification flag to true.
 */
userSchema.methods.verify = async function () {
  this.is_verified = true;
  return await this.save();
};

export const User = model("User", userSchema);
