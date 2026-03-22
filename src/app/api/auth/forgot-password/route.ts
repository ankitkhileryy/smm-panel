import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // we return success anyway to prevent email enumeration
            return NextResponse.json({ message: "If an account exists, a reset link will be sent." }, { status: 200 });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // LOG THE TOKEN TO CONSOLE FOR DEV
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        console.log("------------------------------------------");
        console.log("PASSWORD RESET REQUESTED FOR:", email);
        console.log("LINK:", resetUrl);
        console.log("------------------------------------------");

        // Send Email
        const resetHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
                <h1 style="color: #2b95e9; font-size: 24px; text-transform: uppercase; font-weight: 900;">RESET YOUR PASSWORD</h1>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hello,</p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new one. This link will expire in 1 hour.</p>
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2b95e9; color: white; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">RESET PASSWORD</a>
                </div>
                <p style="color: #64748b; font-size: 12px; line-height: 1.6;">If you didn't request this, you can safely ignore this email.</p>
                <p style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 12px;">© SMM12 - Advanced Social Media Marketing Services</p>
            </div>
        `;

        await sendEmail(email, "Password Reset Request - SMM12", resetHtml);

        return NextResponse.json({ message: "Check your email for password reset link." }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}
