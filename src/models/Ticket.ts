import mongoose from "mongoose";

export interface ITicket extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    subject: string;
    request: "General" | "Order" | "Payment" | "Refill" | "Other";
    order_id?: string;
    status: "Open" | "Pending" | "Answered" | "Closed";
    messages: {
        sender: "User" | "Admin";
        message: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema = new mongoose.Schema<ITicket>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: { type: String, required: true },
        request: {
            type: String,
            enum: ["General", "Order", "Payment", "Refill", "Other"],
            default: "General"
        },
        order_id: { type: String },
        status: {
            type: String,
            enum: ["Open", "Pending", "Answered", "Closed"],
            default: "Open",
        },
        messages: [
            {
                sender: { type: String, enum: ["User", "Admin"], required: true },
                message: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
