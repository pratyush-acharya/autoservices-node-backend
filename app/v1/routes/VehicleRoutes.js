import { Router } from "express";
import { validateCreateVehicle, validateUpdateVehicle } from "../middlewares/validators/VehicleValidators.js";

import { createVehicle, getAllVehicles, getVehicle, removeVehicle, updateVehicle, changeVerificationStatus } from "../controllers/VehicleController.js";

import { verifyRoles } from "../middlewares/verifyRoles.js";

export const router = Router();

router
  .route("/")
  .post([verifyRoles("admin", "user", "receptionist", "mechanic"), validateCreateVehicle], createVehicle)
  .get(verifyRoles("admin", "mechanic", "receptionist"), getAllVehicles);

router
  .route("/:id")
  .get(getVehicle)
  .delete(verifyRoles("admin", "receptionist", "mechanic"), removeVehicle)
  .put([verifyRoles("admin", "user", "receptionist", "mechanic"), validateUpdateVehicle], updateVehicle)
  .patch(verifyRoles("admin", "receptionist", "mechanic"), changeVerificationStatus);
