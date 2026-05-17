import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const dynamic = "force-dynamic";

async function isAdmin(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return false;

        const secret = process.env.JWT_SECRET;
        if (!secret) return false;
        const decoded: any = jwt.verify(token, secret);
        
        await dbConnect();
        const adminUser = await User.findById(decoded.userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export async function GET(req: Request) {
    if (!await isAdmin(req)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "";
        
        const filter = query ? {
            $or: [
                { email: { $regex: query, $options: "i" } },
                { apiKey: { $regex: query, $options: "i" } }
            ]
        } : {};

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json(users);

    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isAdmin(req)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    try {
        const { email, password, balance, role } = await req.json();
        
        const existing = await User.findOne({ email });
        if (existing) return NextResponse.json({ message: "Email already exists" }, { status: 400 });

        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            balance: balance || 0,
            role: role || 'user',
            apiKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        });

        await newUser.save();
        return NextResponse.json({ message: "User created successfully", user: newUser });
    } catch (e: any) {
        return NextResponse.json({ message: "Creation failed", error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    if (!await isAdmin(req)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    try {
        const { userId, balance, password, role, email } = await req.json();
        
        const updateData: any = {};
        if (balance !== undefined) updateData.balance = balance;
        if (role !== undefined) updateData.role = role;
        if (email !== undefined) {
             // Optional: Check if email is already taken by another user
             const existing = await User.findOne({ email, _id: { $ne: userId } });
             if (existing) return NextResponse.json({ message: "Email already taken" }, { status: 400 });
             updateData.email = email;
        }
        if (password) {
             const bcrypt = require("bcryptjs");
             updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "User updated successfully", user });

    } catch (error: any) {
        return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!await isAdmin(req)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");
        if (!userId) return NextResponse.json({ message: "Missing User ID" }, { status: 400 });

        await User.findByIdAndDelete(userId);
        
        return NextResponse.json({ message: "User purged successfully" });
    } catch (e: any) {
        return NextResponse.json({ message: "Deletion failed", error: e.message }, { status: 500 });
    }
}
