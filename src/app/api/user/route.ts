import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    try {
        console.log("Fetching user data...");
        await dbConnect();
        console.log("DB connected for user fetch.");

        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")?.[1]?.split(";")?.[0]?.trim();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);

        if (!decoded.userId) {
            return NextResponse.json({ message: "Invalid session" }, { status: 401 });
        }

        const user = await User.findById(decoded.userId).select("-password").lean().exec();
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Fetch Order Stats
        const orderStats = await Order.aggregate([
            { $match: { user_id: user._id } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$charge" }
                }
            }
        ]);

        const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0 };

        const userData = {
            ...user,
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent
        };

        return NextResponse.json({ user: userData }, { status: 200 });

    } catch (error: any) {
        console.error("User Fetch Error:", error);
        return NextResponse.json({ message: "Error fetching user", error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")?.[1]?.split(";")?.[0]?.trim();
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);

        const body = await req.json();
        const { email, oldPassword, newPassword, avatar, phone, regenerateKey } = body;

        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        // Change Password Logic
        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return NextResponse.json({ message: "Original password mismatch" }, { status: 400 });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Change Email Logic
        if (email && email !== user.email) {
            const exists = await User.findOne({ email });
            if (exists) return NextResponse.json({ message: "Email already in use" }, { status: 400 });
            user.email = email;
        }

        // Change Avatar Logic
        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        // Change Phone Logic
        if (phone !== undefined) {
            user.phone = phone;
        }

        // Regenerate API Key
        if (regenerateKey) {
            const crypto = await import("crypto");
            user.apiKey = crypto.randomBytes(32).toString('hex');
        }

        await user.save();
        return NextResponse.json({ message: "Profile updated successfully", apiKey: user.apiKey });

    } catch (error: any) {
        return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
    }
}
