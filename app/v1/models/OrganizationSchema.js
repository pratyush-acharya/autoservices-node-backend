import mongoose, {Schema, model} from "mongoose";
import {User} from "./UserSchema.js";

/**
 *  This is a Schema created in order to handle Embedding of JSON into the Organization Schema.
 */
const ContractSchema = new Schema({
    start_date: {
        type: Date,
        required: true,
    },

    end_date: {
        type: Date,
        required: true,
    }
})

/**
 * This Schema is used to create Organization Model.
 */
const OrganizationSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "You must enter an Organization Name"],
        maxLength: [50, "Organization name cannot exceed 50 Characters"],
        minLength: [2, "Organization name should be at least 2 Characters Long."]
    },

    contracts: {
        type: [ContractSchema],
        required: true
    },

    user: {
        type: [mongoose.Types.ObjectId],
        ref: User,
        optional: true
    }
});

export const Organization = model('organization', OrganizationSchema)