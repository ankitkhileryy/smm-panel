import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    email: string;
    password?: string;
    balance: number;
    role: "user" | "admin";
    resetToken?: string;
    resetTokenExpiry?: Date;
    referralCode: string;
    referredBy?: mongoose.Types.ObjectId;
    affiliateBalance: number;
    phone?: string;
    apiKey: string;
    avatar?: string;
    customMargin?: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        resetToken: String,
        resetTokenExpiry: Date,
        referralCode: { type: String, unique: true, sparse: true },
        referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        affiliateBalance: { type: Number, default: 0 },
        phone: { type: String },
        apiKey: { type: String, unique: true, sparse: true },
        avatar: { type: String },
        customMargin: { type: Number },
    },
    { timestamps: true }
);

import crypto from "crypto";

// Auto-generate referral code & API Key if missing
UserSchema.pre("save", function (this: any) {
    if (!this.referralCode) {
        this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    if (!this.apiKey) {
        this.apiKey = crypto.randomBytes(32).toString('hex');
    }
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
