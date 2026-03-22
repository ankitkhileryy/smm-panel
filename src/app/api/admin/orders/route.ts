import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();

        const orders = await Order.find().populate("user_id", "email username").sort({ createdAt: -1 }).limit(100).lean();

        // Also get some stats
        const total = await Order.countDocuments();
        const completed = await Order.countDocuments({ status: "Completed" });
        const pending = await Order.countDocuments({ status: { $in: ["Pending", "In progress", "Processing"] } });
        const canceled = await Order.countDocuments({ status: { $in: ["Canceled", "Refunded"] } });

        return NextResponse.json({
            orders,
            stats: {
                total,
                completed,
                pending,
                canceled
            }
        });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to fetch orders", error: error.message }, { status: 500 });
    }
}
