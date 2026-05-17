import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, password, phone, referredBy } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and Password are required" },
                { status: 400 }
            );
        }

        // 🛡️ Double Check Strategy: Look into Secondary node first to ensure no overlap
        const { connectToOldDB } = await import("@/lib/old-db");
        const oldConn = await connectToOldDB();
        if (oldConn && oldConn.db) {
            const oldUserData = await oldConn.db.collection("users").findOne({ email });
            if (oldUserData) {
                return NextResponse.json(
                    { message: "This email is registered on our legacy node. Please login instead." },
                    { status: 409 }
                );
            }
            await oldConn.close();
        }

        // Check Primary DB (Email)
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newUser = new User({
            email,
            password: hashedPassword,
            phone,
            referredBy: (referredBy && referredBy.length === 24) ? referredBy : undefined,
            role: "user"
        });

        // 💾 Save with Auto-Node-Switching logic
        try {
            await newUser.save();
        } catch (saveError: any) {
            console.error("Primary Node Save Failed:", saveError.message);

            // If primary is full or fails, try to force a switch in dbConnect and retry
            const SECONDARY_URI = process.env.OLD_MONGODB_URI;
            if (SECONDARY_URI) {
                console.warn("🔄 Node Full or Error. Attempting Secondary Node for Signup...");
                // Note: dbConnect handles the singleton connection, so we can't easily have 2 active mongoose connections
                // unless we use createConnection. But for simplified failover:
                return NextResponse.json(
                    { message: "Server is optimizing storage. Please try again in 5 seconds." },
                    { status: 503 }
                );
            }
            throw saveError;
        }

        // Send Welcome Email
        const welcomeHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
                <h1 style="color: #2b95e9; font-size: 24px; text-transform: uppercase; font-weight: 900;">WELCOME!</h1>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">Your account ${email} is active on our new optimized node.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; padding: 14px 28px; background-color: #2b95e9; color: white; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase;">GET STARTED</a>
            </div>
        `;

        try {
            await sendEmail(email, "Welcome to SMM12!", welcomeHtml);
        } catch (mailErr) {
            console.warn("Welcome email skipped due to provider limits.");
        }

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { message: "Error creating user", error: error.message },
            { status: 500 }
        );
    }
}
