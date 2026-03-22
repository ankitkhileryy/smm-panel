import mongoose from "mongoose";

export interface IService extends mongoose.Document {
    service: string; // Internal ID
    name: string;
    type: string;
    category: string;
    rate: number; // Final price including margin
    min: number;
    max: number;
    description?: string;
    status: "Active" | "Inactive";
    provider_rate: number; // Raw price from provider
    updatedAt: Date;
}

const ServiceSchema = new mongoose.Schema<IService>(
    {
        service: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String },
        category: { type: String, required: true },
        rate: { type: Number, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        description: { type: String },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        provider_rate: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
