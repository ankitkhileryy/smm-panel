import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature") || "";

        if (!signature) {
            return NextResponse.json({ message: "No signature" }, { status: 400 });
        }

        // IMPORTANT: Verify Webhook Signature for Security
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) return NextResponse.json({ message: "Missing secret" }, { status: 500 });

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("❌ Razorpay Webhook Signature Mismatch");
            return NextResponse.json({ message: "Invalid Signature" }, { status: 400 });
        }

        const data = JSON.parse(body);
        const event = data.event;

        // Process SUCCESSFUL payments
        if (event === "payment.captured") {
            const paymentDetails = data.payload.payment.entity;
            const amountInRupees = paymentDetails.amount / 100;
            const transaction_id = paymentDetails.id;
            const user_email = paymentDetails.email;

            await dbConnect();

            // 1. Prevent Double Credit
            const existingPayment = await Payment.findOne({ transaction_id });
            if (existingPayment?.status === "completed") {
                return NextResponse.json({ status: "ok", message: "Already processed" });
            }

            // 2. Locate User by Email (sent in prefill)
            const user = await User.findOne({ email: user_email });
            if (!user) {
                console.error(`❌ Webhook Error: User not found for email: ${user_email}`);
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            // 3. Mark or Create Payment Record
            if (existingPayment) {
                existingPayment.status = "completed";
                await existingPayment.save();
            } else {
                await Payment.create({
                    user_id: user._id,
                    amount: amountInRupees,
                    transaction_id: transaction_id,
                    method: "razorpay",
                    status: "completed"
                });
            }

            // 4. Update the User's Wallet Balance
            user.balance += amountInRupees;
            await user.save();

            console.log(`✅ Webhook: Added ₹${amountInRupees} to ${user_email}`);
        }

        return NextResponse.json({ status: "ok" });
    } catch (err: any) {
        console.error("❌ Webhook processing error:", err.message);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
