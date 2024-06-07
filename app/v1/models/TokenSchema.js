import mongoose, { Schema, model } from "mongoose";
import { User } from './UserSchema.js';
import { validateUser } from '../middlewares/validators/userTokenValidator.js'

const tokenSchema =  new Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true,
        validate: validateUser
    }
})

export const Token = model('Token', tokenSchema);