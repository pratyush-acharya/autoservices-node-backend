import {logger} from "../utils/logger.js";
import {Category} from "../models/CategorySchema.js";
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";

/**
 * @desc This function creates a new category.
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body)
        await category.save();
        sendSuccessResponse(res, "Category Created", category)
    } catch (err) {
        logger.error("Category couldn't be created: " + err.message)
        sendErrorResponse(res, "Category couldn't be created.")
    }
}

/**
 * @desc This function gets all existing categories.
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        sendSuccessResponse(res, "Category fetched", category)
    } catch (err) {
        sendErrorResponse(res, "Cannot Fetch Category.")
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
        sendSuccessResponse(res, "Categories Fetched.", categories)
    } catch (error) {
        logger.error("Categories couldn't be fetched. Error: " + error.message)
        sendErrorResponse(res, "Categories couldn't be fetched.")
    }
}

export const removeCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        sendSuccessResponse(res, "Category deleted successfully.")
    } catch (e) {
        sendErrorResponse(res, "Category can't be deleted.")
    }
}

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        })
        sendSuccessResponse(res, "Category Updated", category)
    } catch (err) {
        logger.error("Category Update Failed: " + err.message)
        sendErrorResponse(res, "Failed to update category.")
    }
}