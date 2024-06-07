import { Router } from "express";
import { organizationCreateValidation, organizationUpdateValidation } from "../middlewares/validators/OrganizationValidator.js";
import { createOrganizations, getOrganization, getOrganizations, removeOrganization, updateOrganization, getContract, updateContract } from "../controllers/OrganizationController.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";

export const router = Router();
router.route("/").post(verifyRoles("admin"), organizationCreateValidation, createOrganizations).get(verifyRoles("admin"), getOrganizations);

router.route("/:id").get(getOrganization).delete(verifyRoles("admin"), removeOrganization).put(verifyRoles("admin"), organizationUpdateValidation, updateOrganization);

router.route("/contract/").post(getContract);

router.route("/contract/:id").patch(verifyRoles("admin"), organizationUpdateValidation, updateContract);
