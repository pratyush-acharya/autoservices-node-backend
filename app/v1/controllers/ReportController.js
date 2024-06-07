import { logger } from "../utils/logger.js";
import { ServiceRequest } from "../models/ServiceRequestSchema.js";
import { makeMonthlyJson, monthlyReport } from "../utils/monthlyReportExport.js";

import { inQueueJson, inQueueReport } from "../utils/inQueueReport.js";

export const generateMonthlyData = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({
      createdAt: {
        $gte: new Date(req.body.year, req.body.month, 1),
        $lt: new Date(req.body.year, req.body.month + 1, 1),
      },
    });

    const populatedData = serviceRequests.populate("user").populate("solutions").populate("employee");
    let reportObject = makeMonthlyJson(populatedData);
    let workbook = monthlyReport(reportObject);
    return res.status(200).blob(workbook);
  } catch (err) {
    logger.error(`Error during fetch: ${err.message}`);
    throw new Error("Failed to fetch service request.");
  }
};
/**
 * The function generates a report of service requests in a queue and returns a JSON object with the
 * file path and name.
 * @param req - The request object, which contains information about the incoming HTTP request.
 * @param res - The `res` parameter is the response object that will be sent back to the client making
 * the request. It contains methods and properties that allow the server to send a response back to the
 * client, such as `status`, `json`, and `blob`.
 */

export const generateQueueData = async (req, res) => {
  // try {
  //   const serviceRequests = await ServiceRequest.find({});
  //   const populatedData = serviceRequests.populate("user").populate("solutions").populate("employee");

  //   let reportObject = inQueueJson(populatedData);
  //   let workbook = inQueueReport(reportObject);
  //   return res.status(200).blob(workbook);
  // } catch (err) {
  //   logger.error(`Error during fetch: ${err.message}`);
  //   throw new Error("Failed to fetch service request.");
  // }

  try {
    const serviceRequests = await ServiceRequest.find({}).populate("user").populate("solutions").populate("employee");
    console.log(serviceRequests);
    let reportObject = inQueueJson(serviceRequests);
    let workbook = await inQueueReport(reportObject);

    const fileLocation = "/storage/reports/monthly/" + workbook;

    res.status(200).json({
      success: true,
      message: {
        filePath: fileLocation,
        fileName: workbook,
      },
    });
  } catch (err) {
    logger.error(`Error during fetch: ${err.message}`);
    console.log(err);
  }
};
