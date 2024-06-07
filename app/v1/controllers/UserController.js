import path from "path";
import * as fs from "fs";
import bcrypt from "bcrypt";
import { promisify } from "util";
const deleteFile = promisify(fs.unlink);
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse.js";
import { logger } from "../utils/logger.js";
import { User } from "../models/UserSchema.js";
import { isAcceptedImageFile, uploadImage } from "../utils/imageUpload.js";

export const createUser = async (req, res) => {
  console.log("Create user controlled triggered");
  try {
    if (req.files) {
      const user = new User(req.body);
      let filename = req.files.avatar.name;
      //checking image filetype
      const file_extension = path.extname(filename);
      if (!isAcceptedImageFile(file_extension)) {
        return sendErrorResponse(res, "Please use one of the accepted filetypes: .png, .jpeg, .jpg");
      }
      //renaming and saving new profile picture
      filename = `${Date.now()}${file_extension}`;
      let dir = path.join(appRoot, "/storage/profile_pics");
      await uploadImage(req.files.avatar, dir, filename);

      user.avatar = filename;
      user.roles = JSON.parse(req.body.roles);
      await user.save();
    } else {
      return sendErrorResponse(res, "User profile picture missing.");
    }
    return sendSuccessResponse(res, "User Created");
  } catch (err) {
    logger.error("User Creation Failed: ", err);
    return sendErrorResponse(res, "User Creation Failed " + err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return sendSuccessResponse(res, "Fetching of Users Successful", users);
  } catch (err) {
    logger.error("Fetching of Users Unsuccessful: " + err.message);
    return sendErrorResponse(res, "Fetching of Users Unsuccessful");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return sendSuccessResponse(res, "User Fetch Successful", user);
  } catch (err) {
    logger.error("User Fetch Unsuccessful: " + err.message);
    return sendErrorResponse(res, "User Fetch Unsuccessful.");
  }
};

export const removeUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    let currentUser = await User.findOne({ refreshToken: refreshToken });
    const user = await User.findById(req.params.id);
    if (currentUser._id == req.params.id) {
      return sendErrorResponse(res, "Your account cannot be deleted.");
    }
    const oldFile = path.join(appRoot, "/storage/profile_pics", user.avatar);
    await deleteFile(oldFile);
    await user.deleteOne({ _id: req.params.id });
    return sendSuccessResponse(res, "User Deleted.");
  } catch (err) {
    logger.error("User Deletion Unsuccessful: " + err.message);
    return sendErrorResponse(res, "User deletion failed.", err.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (req.files) {
      let filename = req.files.avatar.name;

      //checking image filetype
      const file_extension = path.extname(filename);
      if (!isAcceptedImageFile(file_extension)) {
        return sendErrorResponse(res, "Please use one of the accepted filetypes: .png, .jpeg, .jpg");
      }

      //renaming and saving new profile picture
      filename = `${Date.now()}${file_extension}`;
      let dir = path.join(appRoot, "/storage/profile_pics");
      await uploadImage(req.files.avatar, dir, filename);

      req.body.avatar = filename;

      //deleting old profile picture if it exists
      let oldFile = path.join(appRoot, "/storage/profile_pics", user.avatar);
      await deleteFile(oldFile);
    }
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.roles) {
      req.body.roles = JSON.parse(req.body.roles);
    }

    user = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true,
    });
    return sendSuccessResponse(res, "User Updated", user);
  } catch (err) {
    logger.error("User Update Failed: " + err.message);
    return sendErrorResponse(res, "User Update Failed" + err.message);
  }
};

export const getUserByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const users = await User.find({ roles: role });
    return res.send(users);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Users Fetch Failed",
    });
  }
};
