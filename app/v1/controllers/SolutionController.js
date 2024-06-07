import {logger} from "../utils/logger.js";
import {Solution} from "../models/SolutionSchema.js";
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";
import {ServiceRequest} from "../models/ServiceRequestSchema.js";

export const createSolution = async (req, res) => {
    try {
        const solution = new Solution(req.body);
        await solution.save();
        return sendSuccessResponse(res, "Solution created successfully.", solution)
    } catch (err) {
        logger.error("Error in Solution Create: ", err.message)
        return sendErrorResponse(res, "Solution cannot be created.")
    }
}

export const removeSolution = async (req, res) => {
    try {
        await Solution.findByIdAndDelete(req.params.id)
        return sendSuccessResponse(res, "Solution has been removed.")
    } catch (err) {
        logger.error("Error on solution delete: ", err.message)
        return sendErrorResponse(res, "Solution cannot be removed.")
    }
}

export const updateSolution = async (req, res) => {
    try {
        const solution = await Solution.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        })
        return sendSuccessResponse(res, "Solution Updated.", solution)
    } catch (err) {
        logger.error("Solution cannot be added. A Error has occurred: " + err.message)
        return sendErrorResponse(res, "Solution couldn't be updated.")
    }
}

export const getAllSolution = async (req, res) => {
    try {
        const solutions = await Solution.find({});
        return sendSuccessResponse(res, "Fetching of Data Complete.", solutions)
    } catch (err) {

        return sendErrorResponse(res, "Data Fetch Unsuccessful.")
    }
}

export const getSolution = async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id)
        return sendSuccessResponse(res, "Solution Fetched.", solution)
    } catch (err) {
        logger.error("Solution's Fetched Failed: " + err.message)
        return sendErrorResponse(res, "Failed to fetch data.")
    }
}

export const getSolutionWithCategory = async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id).populate('category');
        return sendSuccessResponse(res, "Solution Fetched with Category", solution)
    } catch (err) {
        return sendErrorResponse(res, "Failed to fetch solution.")
    }
}

export const getAllSolutionWithCategory = async (req, res) => {
    try {
        const solutions = await Solution.find({}).populate('category')
        return sendSuccessResponse(res, "Successfully fetched solution with categories.", solutions)
    } catch (err) {
        return sendErrorResponse(res, "Failed to fetch solution with categories.")
    }
}


export const changeState = async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id);
        solution.state = req.body.state;
        solution.save();
        return sendSuccessResponse(res, "Solution's state changed.", solution)
    } catch (err) {
        logger.error("Solution's State Change Failed: " + err.message)
        return sendErrorResponse(res, "Failed to change state.")
    }
}