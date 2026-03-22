import mongoose from "mongoose";

export interface IOrder extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    service_id: string; // The ID of the service on the provider's end
    link: string;
    quantity: number;
    charge: number;
    status: "Pending" | "Processing" | "In progress" | "Completed" | "Partial" | "Canceled" | "Refunded";
    provider_order_id?: string; // ID returned by the external SMM panel
    refunded: boolean;
    runs?: number; // For drip-feed
    interval?: number; // For drip-feed
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        service_id: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        charge: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "In progress", "Completed", "Partial", "Canceled", "Refunded"],
            default: "Pending",
        },
        provider_order_id: {
            type: String,
        },
        refunded: {
            type: Boolean,
            default: false,
        },
        runs: { type: Number },
        interval: { type: Number },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
