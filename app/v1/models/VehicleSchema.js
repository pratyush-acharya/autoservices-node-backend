import mongoose, {Schema, model} from 'mongoose';
import {User} from '../models/UserSchema.js';
import {Organization} from '../models/OrganizationSchema.js';

/**
 * @desc This is the Vehicle Schema Object used to Create a User Model
 *
 * @return Schema
 */
const vehicleSchema = mongoose.Schema({
    number: {
        type: String,
        required: [true, 'Vehicle number is required.']
    },

    identity_number: {
        type: String,
        required: [true, 'Identity number is required.']
    },

    model: {
        type: String,
        required: [true, 'Vehicle model is required.']
    },

    bluebook: {
        type: String,
        required: [true, "Bluebook Image is required."]
    },

    vehicle_image: {
        type: String,
        required: [true, "Vehicle Image is required."]
    },

    type: {
        type: String,
        required: [true, 'Vehicle type is required.'],
        enum: {
            values: ['organizational', 'personal'],
            message: '{VALUE} is not supported'
        }
    },

    user_id: {
        type: mongoose.Types.ObjectId,
        ref: User,
        optional: true,
        validate: value => {
            return User.findById(value).then(user => {
                if (!user) {
                    return Promise.reject('Invalid User Id');
                }
            });
        }
    },

    organization_id: {
        type: mongoose.Types.ObjectId,
        ref: Organization,
        optional: true,
        validate: value => {
            return Organization.findById(value).then(organization => {
                if (!organization) {
                    return Promise.reject('Invalid Organization Id');
                }
            });
        }
    },

    is_verified: {
        type: Boolean,
        optional: true,
        default: false
    }
});

export const Vehicle = model('Vehicle', vehicleSchema);