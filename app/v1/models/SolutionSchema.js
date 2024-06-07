import mongoose from 'mongoose';
import {Category} from "./CategorySchema.js";

const solutionSchema = new mongoose.Schema({
    category: {
        type: [mongoose.Types.ObjectId],
        ref: Category,
        required: [true, "Solution must belong to a category"],
        minLength: 3,
        maxLength: 255
    },

    detail : {
        type: String,
        required: [true, "Please provide detail of the solution being Applied"],
        minLength: 10
    },

    price : {
        type: Number,
        required: [true, "Solution Price is required."],
        min: 0
    },

    state: {
        type: String,
        optional: true,
        enum: ['accepted', 'completed', 'working', 'rejected', 'verifying'],
        default: "verifying"
    }
});

export const Solution = mongoose.model('solutions', solutionSchema);