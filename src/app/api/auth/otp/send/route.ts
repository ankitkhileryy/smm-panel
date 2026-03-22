import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import dbConnect from "@/lib/mongoose";
import OTP from "@/models/OTP";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();
        if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        await OTP.findOneAndUpdate(
            { identifier: email },
            { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true }
        );

        const otpHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
                <h2 style="color: #2b95e9; text-transform: uppercase; font-weight: 900;">VERIFICATION CODE</h2>
                <p style="color: #475569; font-size: 16px;">Use the following code to verify your account on SMM12.COM:</p>
                <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #0f172a;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `;

        await sendEmail(email, `${otp} is your SMM12 Verification Code`, otpHtml);

        return NextResponse.json({ message: "OTP Sent to Email" });
    } catch (e: any) {
        return NextResponse.json({ message: "Email Pipeline Failure", error: e.message }, { status: 500 });
    }
}
