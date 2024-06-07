import { ServiceRequest } from "../models/ServiceRequestSchema.js";
import { Vehicle } from "../models/VehicleSchema.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse.js";

export const index = async (req, res) => {
  const dayWise = await ServiceRequest.aggregate([{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }]);

  const monthly = await ServiceRequest.aggregate([{ $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }]);

  const yearly = await ServiceRequest.aggregate([{ $group: { _id: { $year: "$createdAt" }, count: { $sum: 1 } } }]);

  // get all service request
  const serviceRequests = await ServiceRequest.find({}).populate("vehicle");

  //   [{
  //     _id: new ObjectId("643f28adb200cd536d7b266f"),
  //     is_pickup: false,
  //     is_dropoff: true,
  //     pickup_detail: {
  //       street: 'chapramari road',
  //       ward: '7',
  //       locality: 'bazar chok',
  //       _id: new ObjectId("643f2730751f61466101b6c5")
  //     },
  //     dropoff_detail: {
  //       street: 'hokola road',
  //       ward: '2',
  //       locality: 'damak chok',
  //       _id: new ObjectId("643f2730751f61466101b6c6")
  //     },
  //     user: new ObjectId("64371112b7edbc265c85c04d"),
  //     vehicle: {
  //       number: 'NP-03-C-9012',
  //       identity_number: 'JHMFA3F27AS001234',
  //       model: 'Hatchback\t',
  //       type: 'personal',
  //       _id: new ObjectId("643f2730751f61466101b6c7")
  //     },
  //     issue: [ 'Vehicle requires door replacement.' ],
  //     solutions: [],
  //     state: 'waiting',
  //     new_customer: true,
  //     createdAt: 2023-05-18T23:26:40.529Z,
  //     updatedAt: 2023-05-18T23:26:40.529Z,
  //     __v: 0
  //   }
  // ]

  // when we log serviceRequests, we get an array of objects. Each object has a vehicle property which is an object. We want to get the vehicle with no of service requests done by them. using loop lastly we need array of objects with vehicle and count property.

  const vehicles = [];

  for (let i = 0; i < serviceRequests.length; i++) {
    const vehicle = serviceRequests[i].vehicle;
    const vehicleIndex = vehicles.findIndex((v) => v.vehicle._id.toString() === vehicle._id.toString());
    if (vehicleIndex === -1) {
      vehicles.push({ vehicle, count: 1 });
    } else {
      vehicles[vehicleIndex].count++;
    }
  }

  //  sort vehicles by count
  vehicles.sort((a, b) => b.count - a.count);

  console.log(vehicles);
  return sendSuccessResponse(res, "Dashboard data sent successfully.", { dayWise, monthly, yearly, vehicles });
};
