import {logger} from "../utils/logger.js";
import {Employee} from "../models/EmployeeSchema.js";
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../utils/sendResponse.js";

export const getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        return sendSuccessResponse(res, "Employee successfully fetched.", employee)
    } catch (err) {
        logger.error(`Fetch in fetching all employee: ${err.message}`)
        return sendErrorResponse(res, "Failed to fetch employee." + err.message)
    }
}

export  const getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.find({});
        return sendSuccessResponse(res, "Employee fetched.", employees)
    } catch (err) {
        logger.error(`Error during fetch: ${err.message}`)
        return sendSuccessResponse(res, "Failed to fetch employee.")
    }
}

export const createEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save()
        return sendSuccessResponse(res, "Employee successfully created.", employee)
    } catch (err) {
        logger.error(`Error in request created: ${err.message}`)
        return sendErrorResponse(res, "Failed to create employee.")
    }
}

export const removeEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id);
        return sendSuccessResponse(res, "Employee deleted.")
    } catch (err) {
        logger.error(`Error in request remove: ${err.message}`)
        return sendErrorResponse(res, "Employee cannot be deleted.")
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true, new: true
        });
        return sendSuccessResponse(res, "Employee updated.", employee)
    } catch (err) {
        logger.error(`Error in request update: ${err.message}`)
        return sendErrorResponse(res, "Employee cannot be updated.")
    }
}