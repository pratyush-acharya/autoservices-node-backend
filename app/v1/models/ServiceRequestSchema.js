import {User} from "./UserSchema.js";
import {Solution} from "./SolutionSchema.js";
import mongoose, {Schema, model} from 'mongoose';


const partialVehicle = new Schema({
    number: {
        type: String,
        required: true
    },

    identity_number: {
        type: String,
        required: true,
    },

    model: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true
    },
})

const location = new Schema({
    street: {
        type: String,
        optional: true
    },

    ward: {
        type: String,
        optional: true
    },

    locality: {
        type: String,
        required: true
    }
})

const serviceRequestSchema = new Schema({
    is_pickup: {
        type: Boolean,
        required: true
    },

    is_dropoff: {
        type: Boolean,
        required: true
    },

    pickup_detail: {
        type: location,
        optional: true
    },

    dropoff_detail: {
        type: location,
        optional: true
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },

    vehicle: {
        type: partialVehicle,
        required: true
    },

    issue: {
        type: [String],
        required: true
    },

    solutions: [
        {
            type: Schema.ObjectId,
            ref: Solution
        }
    ],

    state: {
        type: String,
        enum: ['working', "waiting", "Customer out of Reach", 'completed', 'paid'],
        optional: true,
        default: "waiting"
    },

    discount: {
        type: {
            type: String,
            enum: ["cash", "percentage"],
            optional: true
        },

        value: {
            type: Number,
            optional: true
        }
    },

    employee: {
        type: mongoose.Types.ObjectId,
        optional: true,
    },

    total_paid: {
        type: Number,
        optional: true
    },

    new_customer: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

export const ServiceRequest = model('Service Request', serviceRequestSchema)