import { Organization } from "../models/OrganizationSchema.js";
import { logger } from "../utils/logger.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse.js";

export const createOrganizations = async (req, res) => {
  try {
    const organization = new Organization(req.body);
    await organization.save();
    logger.info("Organization successfully added.");
    return sendSuccessResponse(res, "Organization Created", organization);
  } catch (err) {
    logger.error("Failed to create organization.");
    return sendErrorResponse(res, "Organization Creation Failed.", err.message);
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({}).populate("user", { _id: 1, name: 1, phone_number: 1 });
    return sendSuccessResponse(res, "Organizations successfully fetched.", organizations);
  } catch (err) {
    logger.error("Failed to fetch organizations");
    return sendErrorResponse(res, "Failed to fetch organizations.", err.message);
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate("user", { _id: 1, name: 1, phone_number: 1 });
    return sendSuccessResponse(res, "Organization successfully fetched.", organization);
  } catch (err) {
    logger.error("Organization Fetch Unsuccessful.");
    return sendErrorResponse(res, "Failed to fetch organization.", err.message);
  }
};

export const removeOrganization = async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id);
    logger.info(`Organization removed having id: ${req.params.id}`);
    return sendSuccessResponse(res, "Organization successfully deleted.");
  } catch (err) {
    logger.error(`Organization Deletion Failed - ${err.message}`);
    return sendErrorResponse(res, "Organization Deletion Failed.", err.message);
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    logger.info("Organization successfully updated.");
    return sendSuccessResponse(res, "Organization successfully updated.", organization);
  } catch (err) {
    logger.error("Failed to update organization");
    return sendErrorResponse(res, "Failed to update organization.", err.message);
  }
};

export const getContract = async (req, res) => {
  console.log(req.body);
  const organization = await Organization.findById(req.body.org);
  const contract = organization.contracts.id(req.body.id);
  return sendSuccessResponse(res, "Contract fetched successfully.", contract);
};

export const updateContract = async (req, res) => {
  try {
    const organization = await Organization.findById(req.body.organization);
    const contract = organization.contracts.id(req.params.id);
    contract.start_date = req.body.start_date;
    contract.end_date = req.body.end_date;
    organization.save();

    return sendSuccessResponse(res, "Contract successfully updated.", organization);
  } catch (err) {
    logger.error("Contract Update Failed!");
    return sendErrorResponse(res, "Failed to update contract.", err.message);
  }
};
