import mongoose from "mongoose";

export interface IPayment extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    transaction_id: string;
    amount: number;
    status: "Pending" | "Completed" | "Failed";
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transaction_id: {
            type: String,
            required: true,
            unique: true, // Prevent same transaction ID from being used twice
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
