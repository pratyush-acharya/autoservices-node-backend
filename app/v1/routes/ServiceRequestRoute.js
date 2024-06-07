import { Router } from "express";
import { getServiceRequest, createServiceRequest, removeServiceRequest, getAllServiceRequest, updateServiceRequest, addSolution, changeState } from "../controllers/ServiceRequestController.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";

import { solutionCreateValidation } from "../middlewares/validators/SolutionValidator.js";
import { serviceRequestValidation } from "../middlewares/validators/ServiceRequestValidator.js";

export const router = Router();

router.route("/").get(verifyRoles("admin", "mechanic", "receptionist"), getAllServiceRequest).post(verifyRoles("admin", "user"), serviceRequestValidation, createServiceRequest);

router.route("/:id").get(verifyRoles("admin", "user", "mechanic", "receptionist"), getServiceRequest).put(verifyRoles("admin", "mechanic"), updateServiceRequest).delete(verifyRoles("admin"), removeServiceRequest).patch(verifyRoles("admin", "mechanic"), changeState);

router.route("/addSolution/:id").post(verifyRoles("admin", "mechanic", "receptionist"), solutionCreateValidation, addSolution);
