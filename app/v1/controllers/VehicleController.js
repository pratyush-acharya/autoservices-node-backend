import path from 'path';
import * as fs from 'fs';

import { promisify } from 'util';
import { logger } from "../utils/logger.js";
import { Vehicle } from '../models/VehicleSchema.js';
import {
    sendSuccessResponse,
    sendErrorResponse
} from "../utils/sendResponse.js";
import { isAcceptedImageFile, uploadImage } from '../utils/imageUpload.js'

const deleteFile = promisify(fs.unlink);

export const createVehicle = async (req, res) => {
    try {
        if (req.files) {
            const vehicle = new Vehicle(req.body);
            let files = await saveFile(req, res);
            files === [] ? sendErrorResponse(res, "Files could not be saved") : vehicle.bluebook = files.bluebook;
            vehicle.vehicle_image = files.vehicle_image;
            await vehicle.save();
        } else {
            return sendErrorResponse(res, "Files Missing");
        }
        return sendSuccessResponse(res, "Vehicle Created");
    } catch (err) {
        logger.error("Vehicle Creation Failed: " + err.message)
        return sendErrorResponse(res, "Vehicle Creation Failed.")
    }
};

export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate(["user_id", "organization_id"]);
        return sendSuccessResponse(res, "Fetching of Vehicles Successful", vehicles)
    } catch (err) {
        logger.error("Vehicles Fetch Failed: " + err.message)
        return sendErrorResponse(res, "Vehicles Fetch Failed.")
    }
};

export const getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
        .populate('user_id', { _id: 1, name: 1, phone_number: 1})
        .populate('organization_id', { _id: 1, name: 1});;
        return sendSuccessResponse(res, "Vehicle Fetch Successful", vehicle)
    } catch (err) {
        logger.error("Vehicle Fetch Failed: " + err.message)
        return sendErrorResponse(res, "Vehicle Fetch Failed"+ err)
    }
};

export const removeVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        const bluebook = path.join(appRoot, '/storage/vehicles', vehicle.bluebook);
        const vehicleImage = path.join(appRoot, '/storage/vehicles', vehicle.vehicle_image);
        const files = [bluebook, vehicleImage];
        
        files.forEach(file => {
            deleteFile(file);
        })
        
        await vehicle.deleteOne({_id: req.params.id})
        return sendSuccessResponse(res, "Vehicle Deleted")
    } catch (err) {
        logger.error("Vehicle Deletion Failed: " + err.message)
        return sendErrorResponse(res, "Vehicle Deletion Failed");

    }
};

export const updateVehicle = async (req, res) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);
        if (req.files) {
            let oldBluebook = path.join(appRoot, '/storage/vehicles', vehicle.bluebook);
            let oldVehicleImage = path.join(appRoot, '/storage/vehicles', vehicle.vehicle_image);
            let files = await saveFile(req, res)

            if (files == []) {
               return sendErrorResponse(res, "Failed to save new image files")
            }

            if(req.files.bluebook != null){
                req.body.bluebook = files.bluebook;
                deleteFile(oldBluebook);
            }
            if (req.files.vehicle_image != null) {
                req.body.vehicle_image = files.vehicle_image
                deleteFile(oldVehicleImage);
            }
        }
        if(req.body.user_id && vehicle.organization_id){
            vehicle.organization_id = null;
        }
        if(req.body.organization_id && vehicle.user_id){
            vehicle.user_id = null;
        }
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicle._id,
            req.body, {
                new: true,
                runValidators: true
            }
        );
        return sendSuccessResponse(res, "Vehicle Update Successful", vehicle);
    } catch (err) {
        logger.error("Vehicle Update Failed: " + err.message)
        return sendErrorResponse(res, "Vehicle Update Failed.")
    }
}

export const changeVerificationStatus = async (req, res) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        {is_verified: req.body.is_verified},
        {new: true}
    );
    return sendSuccessResponse(res, "Vehicle Update Successful", vehicle);
}

const saveFile = async (req, res) => {
    let files = [];

    for(const key of Object.keys(req.files)){
        const file_extension = path.extname(req.files[key].name);
        if (!isAcceptedImageFile(file_extension)) {
            return sendErrorResponse(res,  "Please use one of the accepted filetypes: .png, .jpeg, .jpg")
        }

        let filename = `${Date.now()}${file_extension}`;
        let dir = path.join(appRoot, '/storage/vehicles/');
        
        if (key == "bluebook") {
            await uploadImage(req.files.bluebook, dir, filename);
            files.push(["bluebook", filename])
        } else if (key == "vehicle_image") {
            await uploadImage(req.files.vehicle_image, dir, filename);
            files.push(["vehicle_image", filename])
        }
    }

    files = Object.fromEntries(files);
    return files;
}