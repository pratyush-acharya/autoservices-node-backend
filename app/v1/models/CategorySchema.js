import {Schema, model} from "mongoose";


const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        minLength: [4, "Category name should be greater than 5 letters."],
        maxLength: [255, "Category name cannot be  greater than 255 characters."],
        unique: true
    },

    description: {
        type: String,
        required: [true, "Category description is required."],
        maxLength: [1000, "Cannot exceed more than 1000 characters."]
    }
})

export const Category = model('category', categorySchema)