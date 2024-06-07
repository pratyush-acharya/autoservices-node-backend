import mongoose from "mongoose";
import {User} from "./UserSchema.js";

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },

    otp: {
        type: Number,
        min: 1000,
        max: 9999
    },

    phone_number: {
        type: String,
        required: [true, "Phone Number is a required parameter."],
        minLength: [7, "Phone number should be between 7 to 10 characters."],
        maxLength: [10, "Phone number should be between 7 to 10 characters."]
    },

    is_used: {
        type: Boolean,
        optional: true,
        default: false
    },

    expiresAt: {
        type: Date,
        optional: true,
    }

}, {timestamps: true})

otpSchema.index({ phone_number: 1, otp: 1, is_used: 1 }, { unique: true })

otpSchema.pre('save', async function save(next) {
    try {
        this.expiresAt = new Date(Date.now() + 3 * 60 * 1000);
        return next();
    } catch (err) {
        return next(err);
    }
});

otpSchema.methods.utilized = async function utilized() {
    this.is_used = true;
    await this.save();
}

export const OTPModel = mongoose.model('OTP', otpSchema)