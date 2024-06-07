import { Router } from "express";
import { createSolution, removeSolution, getAllSolution, getSolution, updateSolution, getSolutionWithCategory, changeState } from "../controllers/SolutionController.js";
import { solutionCreateValidation, solutionUpdateValidation } from "../middlewares/validators/SolutionValidator.js";

import { verifyRoles } from "../middlewares/verifyRoles.js";

export const router = Router();

router.route("").get(verifyRoles("admin", "receptionist", "mechanic"), getAllSolution).post(verifyRoles("admin", "mechanic"), solutionCreateValidation, createSolution);

router.route("/:id").get(verifyRoles("admin", "user", "mechanic", "receptionist"), getSolution).put(verifyRoles("admin", "mechanic", "receptionist"), solutionUpdateValidation, updateSolution).delete(verifyRoles("admin", "mechanic"), removeSolution);

router.route("/change-state/:id").post(changeState);

router.route("/category/:id").get(verifyRoles("admin", "receptionist", "mechanic"), getSolutionWithCategory);
