import mongoose from "mongoose";

const AffiliateTransactionSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The affiliate who got commission
        referred_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The user who placed order
        order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        amount: { type: Number, required: true },
        percentage: { type: Number, required: true },
        status: { type: String, enum: ["Completed", "Pending", "Cancelled"], default: "Completed" }
    },
    { timestamps: true }
);

export default mongoose.models.AffiliateTransaction || mongoose.model("AffiliateTransaction", AffiliateTransactionSchema);
