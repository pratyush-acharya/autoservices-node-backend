import {
    createCategory,
    removeCategory,
    getCategory,
    getAllCategory,
    updateCategory
} from '../controllers/CategoryController.js';
import {Router} from "express";
import {
    createCategoryValidator,
    updateCategoryValidator
} from "../middlewares/validators/CategoryValidator.js";
import {verifyRoles} from "../middlewares/verifyRoles.js";

export const router = Router();
router.route('/')
    .post(verifyRoles('admin', 'mechanic'), createCategoryValidator,createCategory)
    .get(getAllCategory)

router.route('/:id')
    .get(getCategory)
    .delete(verifyRoles('admin', 'mechanic'), removeCategory)
    .put(verifyRoles('admin', 'mechanic'), updateCategoryValidator, updateCategory)
