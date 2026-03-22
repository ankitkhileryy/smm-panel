import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount // In INR
        } = await req.json();

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ message: "Razorpay secret is missing." }, { status: 500 });
        }

        // 1. Verify Signature
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ message: "Invalid payment signature." }, { status: 400 });
        }

        // 2. Identify User from Token
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")?.[1]?.split(";")?.[0]?.trim();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token found" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
        const decoded: any = jwt.verify(token, secret);

        if (!decoded.userId) {
            return NextResponse.json({ message: "Invalid session" }, { status: 401 });
        }

        // 3. Update User Balance in DB (Deduct 5% Fee)
        await dbConnect();
        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const netAmount = Number(amount) * 0.95; // 5% Fee deducted
        user.balance += netAmount;
        await user.save();

        // Send Funds Added Email
        const fundsHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
                <h1 style="color: #10b981; font-size: 24px; text-transform: uppercase; font-weight: 900;">FUNDS ADDED</h1>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hello,</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">Your account balance has been updated. A 5% transaction fee was applied.</p>
                <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="color: #166534; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 5px;">Recharged</td>
                            <td style="color: #166534; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 5px;">Fee (5%)</td>
                            <td style="color: #166534; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 5px; text-align: right;">Net Balance</td>
                        </tr>
                        <tr>
                            <td style="color: #064e3b; font-size: 20px; font-weight: 900;">₹${Number(amount).toFixed(2)}</td>
                            <td style="color: #ef4444; font-size: 20px; font-weight: 900;">-₹${(Number(amount) * 0.05).toFixed(2)}</td>
                            <td style="color: #064e3b; font-size: 20px; font-weight: 900; text-align: right;">₹${user.balance.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">You can now use these funds to purchase SMM services from your dashboard.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: white; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 20px;">GO TO DASHBOARD</a>
                <p style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 12px;">© SMM12 - Advanced Social Media Marketing Services</p>
            </div>
        `;

        await sendEmail(user.email, "Funds Added Successfully - SMM12", fundsHtml);

        return NextResponse.json({
            message: "Payment verified and balance updated",
            newBalance: user.balance
        }, { status: 200 });

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ message: "Error verifying payment.", error: error.message }, { status: 500 });
    }
}
