import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import AffiliateTransaction from "@/models/AffiliateTransaction";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export async function GET(req: Request) {
    try {
        await dbConnect();
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, secret);
        const user = await User.findById(decoded.userId).select("referralCode affiliateBalance");

        const referralsCount = await User.countDocuments({ referredBy: decoded.userId });
        const recentTransactions = await AffiliateTransaction.find({ user_id: decoded.userId })
            .populate("referred_user_id", "email")
            .sort("-createdAt")
            .limit(10);

        const totalEarnings = await AffiliateTransaction.aggregate([
            { $match: { user_id: user._id, status: "Completed" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        return NextResponse.json({
            referralCode: user.referralCode,
            affiliateBalance: user.affiliateBalance,
            referralsCount,
            totalEarnings: totalEarnings[0]?.total || 0,
            recentTransactions
        });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}
