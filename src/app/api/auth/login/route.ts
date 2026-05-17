import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        console.log("Login attempt initiated...");
        console.log("Connecting to database...");
        await dbConnect();
        console.log("DB connection established. Querying user...");

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // 1. Find the user in Primary DB
        let user = await User.findOne({ email }).exec();

        if (!user) {
            console.log(`User not in Primary DB. Checking Old DB fallback...`);
            const { connectToOldDB } = await import("@/lib/old-db");
            const oldConn = await connectToOldDB();

            if (oldConn && oldConn.db) {
                const oldUserData = await oldConn.db.collection("users").findOne({ email });
                if (oldUserData) {
                    console.log(`User found in Old DB! Synchronizing to Primary DB...`);
                    // Create in primary DB for future logins
                    user = new User({
                        email: oldUserData.email,
                        password: oldUserData.password,
                        balance: oldUserData.balance || 0,
                        role: oldUserData.role || "user",
                    });
                    await user.save();
                    console.log(`Synchronization complete.`);
                }
                await oldConn.close();
            }
        }

        if (!user) {
            console.log(`Login failed: User record not found in either DB for (${email})`);
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        console.log("User found. Comparing passwords...");
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for ${email}`);
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 🔑 Sign JWT
        const finalRole = user.role;

        // Sign JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }
        const token = jwt.sign(
            { userId: user._id, role: finalRole },
            secret,
            { expiresIn: "7d" }
        );

        // Create the response and set cookie
        const response = NextResponse.json(
            {
                message: "Logged in successfully",
                user: { email: user.email, role: finalRole, balance: user.balance }
            },
            { status: 200 }
        );

        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: false, // Changed to false to allow HTTP/IP access without SSL
            sameSite: "lax", // Changed from strict to lax for better compatibility
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        console.log(`Login successful for ${email}`);
        return response;
    } catch (error: any) {
        console.error("Login Route Error:", error);
        return NextResponse.json(
            { message: "Error logging in", error: error.message },
            { status: 500 }
        );
    }
}

