import { Router } from "express";

import { userCreateValidation, userUpdateValidation } from "../middlewares/validators/userValidator.js";

import { createUser, getAllUsers, getUser, removeUser, updateUser, getUserByRole } from "../controllers/UserController.js";

import { verifyRoles } from "../middlewares/verifyRoles.js";

export const router = Router();

router.route("/").post(verifyRoles("admin", "receptionist", "mechanic"), userCreateValidation, createUser).get(verifyRoles("admin", "receptionist", "mechanic"), getAllUsers);

router.route("/:id").get(getUser).delete(verifyRoles("admin", "receptionist", "mechanic"), removeUser).put(verifyRoles("admin", "user", "receptionist", "mechanic"), userUpdateValidation, updateUser);

router.route("/role/:role").get(verifyRoles("admin", "receptionist", "mechanic"), getUserByRole);
