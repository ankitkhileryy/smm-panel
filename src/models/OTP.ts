import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    identifier: { type: String, required: true }, // email or phone
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: '10m' } } // Auto-delete after 10 mins
});

export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
