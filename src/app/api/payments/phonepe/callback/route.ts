import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Settings from "@/models/Settings";

const DEFAULT_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const DEFAULT_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const base64Response = body.response;
        
        await dbConnect();
        const settings = await Settings.findOne();
        
        const SALT_KEY = settings?.phonepeSaltKey || DEFAULT_SALT_KEY;
        const SALT_INDEX = settings?.phonepeSaltIndex || DEFAULT_SALT_INDEX;

        if (!SALT_KEY) {
            console.error("PhonePe Salt Key not configured");
            return NextResponse.json({ message: "Salt Key not configured" }, { status: 500 });
        }

        // Step 1: Verify Checksum
        const xVerify = req.headers.get("X-VERIFY");
        const stringToHash = base64Response + SALT_KEY;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        const expectedChecksum = `${sha256}###${SALT_INDEX}`;

        if (xVerify !== expectedChecksum) {
            console.error("PhonePe Checksum Mismatch");
            return NextResponse.json({ message: "Checksum mismatch" }, { status: 400 });
        }

        // Step 2: Decode Response
        const responseData = JSON.parse(Buffer.from(base64Response, "base64").toString());
        console.log("PhonePe Callback Response Data:", responseData);

        if (responseData.success && responseData.code === "PAYMENT_SUCCESS") {
            const userId = responseData.data.merchantUserId;
            const amount = responseData.data.amount / 100; // back to INR
            const merchantTransactionId = responseData.data.merchantTransactionId;

            // Check if this payment already exists and is completed
            const existingPayment = await Payment.findOne({ transaction_id: merchantTransactionId });
            
            if (existingPayment && existingPayment.status === "Completed") {
                console.log("Payment already processed");
                return NextResponse.json({ success: true, message: "Already processed" });
            }

            // Create or Update payment record
            if (existingPayment) {
                existingPayment.status = "Completed";
                await existingPayment.save();
            } else {
                await Payment.create({
                    user_id: userId,
                    transaction_id: merchantTransactionId,
                    amount: amount,
                    status: "Completed"
                });
            }

            // Update user balance
            const user = await User.findById(userId);
            if (user) {
                user.balance += amount;
                await user.save();
                console.log(`Credited ₹${amount} to ${user.email} (PhonePe Callback)`);
            }
        } else {
             const merchantTransactionId = responseData.data.merchantTransactionId;
             await Payment.findOneAndUpdate(
                 { transaction_id: merchantTransactionId },
                 { status: "Failed" },
                 { upsert: true }
             );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("PhonePe Callback Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
