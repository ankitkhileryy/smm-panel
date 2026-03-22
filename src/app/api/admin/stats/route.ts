import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import Service from "@/models/Service";

import AffiliateTransaction from "@/models/AffiliateTransaction";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();

        // 1. Order Stats
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const statsMap = orderStats.reduce((acc: any, curr: any) => {
            acc[curr._id.toLowerCase()] = curr.count;
            return acc;
        }, { pending: 0, processing: 0, completed: 0, canceled: 0 });

        // 2. User & Financial Stats
        const totalUsers = await User.countDocuments();
        const users = await User.find().select("email balance role createdAt").sort("-createdAt").limit(10);

        const totalProfitData = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$charge" } } }
        ]);

        // 3. Platform Performance (Aggregation)
        const platformPerformance = await Order.aggregate([
            {
                $lookup: {
                    from: "services",
                    localField: "service_id",
                    foreignField: "service",
                    as: "serviceDetails"
                }
            },
            { $unwind: { path: "$serviceDetails", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$serviceDetails.category",
                    count: { $sum: 1 },
                    revenue: { $sum: "$charge" }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 6 }
        ]);

        // 4. Affiliate Payouts magnitude
        const totalCommissions = await AffiliateTransaction.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // 5. Monthly Revenue Aggregate
        const monthlyRevenue = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$charge" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return NextResponse.json({
            stats: {
                orders: statsMap,
                totalUsers,
                revenue: totalProfitData[0]?.total || 0,
                platformPerformance: platformPerformance.map(p => ({ category: p._id || "Other", count: p.count, revenue: p.revenue })),
                commissions: totalCommissions[0]?.total || 0,
                monthlyRevenue: monthlyRevenue.map(m => ({ month: m._id, total: m.total }))
            },
            recentUsers: users
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}

// Update User Balance
export async function PATCH(req: Request) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();
        const { email, amount, action } = await req.json(); // action: "add" or "set"

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        if (action === "add") {
            user.balance += parseFloat(amount);
        } else if (action === "subtract") {
            user.balance -= parseFloat(amount);
        } else {
            user.balance = parseFloat(amount);
        }

        await user.save();
        return NextResponse.json({ message: "Balance updated successfully", newBalance: user.balance });

    } catch (error: any) {
        return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }
}
