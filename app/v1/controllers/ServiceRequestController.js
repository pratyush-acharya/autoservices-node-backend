import { logger } from "../utils/logger.js";
import { Vehicle } from "../models/VehicleSchema.js";
import { Solution } from "../models/SolutionSchema.js";
import { ServiceRequest } from "../models/ServiceRequestSchema.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse.js";

export const getServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate("user", { _id: 1, name: 1, phone_number: 1 }).populate("solutions");
    return sendSuccessResponse(res, "Service request successfully fetched.", serviceRequest);
  } catch (err) {
    logger.error(`Fetch in fetching all service request: ${err.message}`);
    return sendErrorResponse(res, "Failed to fetch service request.", err.message);
  }
};

export const getAllServiceRequest = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({}).populate("user", { _id: 1, name: 1, phone_number: 1 });
    return sendSuccessResponse(res, "Service request fetched.", serviceRequests);
  } catch (err) {
    logger.error(`Error during fetch: ${err.message}`);
    return sendErrorResponse(res, "Failed to fetch service request.", err.message);
  }
};

export const createServiceRequest = async (req, res) => {
  try {
    const { vehicle_id } = req.body;
    const actualVehicle = await Vehicle.findById(vehicle_id);
    let previousRequest = await ServiceRequest.find({ user: req.body.user });
    req.body.new_customer = previousRequest.length <= 0;

    if (actualVehicle) {
      req.body.vehicle = {
        number: actualVehicle.number,
        type: actualVehicle.type,
        model: actualVehicle.model,
        identity_number: actualVehicle.identity_number,
      };
    } else {
      throw new Error("Vehicle doesn't exist.");
    }

    const serviceRequest = new ServiceRequest(req.body);
    await serviceRequest.save();
    return sendSuccessResponse(res, "Service request successfully created.", serviceRequest);
  } catch (err) {
    logger.error(`Error in request created: ${err.message}`);
    return sendErrorResponse(res, "Failed to create service request", err.message);
  }
};

export const removeServiceRequest = async (req, res) => {
  try {
    await ServiceRequest.findByIdAndRemove(req.params.id);
    return sendSuccessResponse(res, "Service request deleted.");
  } catch (err) {
    logger.error(`Error in request remove: ${err.message}`);
    return sendErrorResponse(res, "Service request cannot be deleted.", err.message);
  }
};

export const updateServiceRequest = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.vehicle_id) {
      const actualVehicle = await Vehicle.findById(req.body.vehicle_id);
      req.body.vehicle = {
        number: actualVehicle.number,
        type: actualVehicle.type,
        model: actualVehicle.model,
        identity_number: actualVehicle.identity_number,
      };
    }
    if (req.body.issues) {
      let issues = req.body.issues;
      let issuesArray = [];
      if (!Array.isArray(issues)) {
        issuesArray.push(issues);
      } else {
        for (const issue of issues) {
          issuesArray.push(issue);
        }
      }
      req.body.issue = issuesArray;
    }
    if (req.body.solutions) {
      let solutions = req.body.solutions;
      let solutionsArray = [];
      if (!Array.isArray(solutions)) {
        solutionsArray.push(solutions);
      } else {
        for (const soln of solutions) {
          solutionsArray.push(soln);
        }
      }
      req.body.solutions = solutionsArray;
    }
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return sendSuccessResponse(res, "Service request updated successfully.", serviceRequest);
  } catch (err) {
    logger.error(`Error in update logic: ${err.message}`);
    return sendErrorResponse(res, "Service request cannot be updated." + err.message);
  }
};

export const changeState = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, { state: req.body.state }, { new: true });
    return sendSuccessResponse(res, "Service request state Update Successful", serviceRequest);
  } catch (err) {
    logger.error(`Error in update logic: ${err.message}`);
    return sendErrorResponse(res, "Service request state cannot be updated.", err.message);
  }
};

export const addSolution = async (req, res) => {
  try {
    const solution = Solution(req.body);
    await solution.save();

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, { $push: { solutions: solution._id } }, { new: true, runValidators: true });

    return sendSuccessResponse(res, "Solution added.", serviceRequest);
  } catch (err) {
    logger.error(`Error in addSolution: ${err.message}`);
    return sendErrorResponse(res, "Solution cannot be added.", err.message);
  }
};

export const removeSolution = async (req, res) => {
  try {
    await Solution.findByIdAndRemove(req.params.solution_id);
    await ServiceRequest.findById(req.param.id, { $pull: { solutions: req.params.solution_id } });
    return sendSuccessResponse(res, "Solution removed.");
  } catch (err) {
    logger.error(`Error has occurred during: ${err.message}`);
    return sendErrorResponse(res, "Cannot remove solutions.", err.message);
  }
};

export const addEmployee = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    return sendSuccessResponse(res, "Employee added.", serviceRequest);
  } catch (err) {
    logger.error(`Error has occurred during: ${err.message}`);
    return sendErrorResponse(res, "Cannot add employee.", err.message);
  }
};
