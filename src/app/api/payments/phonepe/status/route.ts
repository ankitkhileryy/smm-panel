export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Settings from "@/models/Settings";
import { generateStatusChecksum } from "@/lib/phonepe-utils";

const DEFAULT_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const DEFAULT_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const DEFAULT_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const API_URL = process.env.PHONEPE_API_URL;

export async function POST(req: Request) {
    try {
        const { merchantTransactionId } = await req.json();

        // Check DB first for processed payment
        await dbConnect();
        
        const settings = await Settings.findOne();
        const MERCHANT_ID = settings?.phonepeMerchantId || DEFAULT_MERCHANT_ID;
        const SALT_KEY = settings?.phonepeSaltKey || DEFAULT_SALT_KEY;
        const SALT_INDEX = settings?.phonepeSaltIndex || DEFAULT_SALT_INDEX;

        if (!MERCHANT_ID || !SALT_KEY) {
            return NextResponse.json({ message: "PhonePe credentials not configured" }, { status: 500 });
        }

        let payment = await Payment.findOne({ transaction_id: merchantTransactionId });
        
        if (payment && (payment.status === "Completed" || payment.status === "Failed")) {
            return NextResponse.json({ 
                success: true, 
                payment_status: payment.status,
                manual_check: false
            });
        }

        // If not processed yet, manually check with PhonePe
        const checksum = generateStatusChecksum(merchantTransactionId, MERCHANT_ID, SALT_KEY, SALT_INDEX);
        const response = await fetch(`${API_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": MERCHANT_ID
            }
        });

        const data = await response.json();
        console.log("PhonePe Status Check Data:", data);

        if (data.success && data.code === "PAYMENT_SUCCESS") {
            const userId = data.data.merchantUserId;
            const amount = data.data.amount / 100;

            // Handle DB update in case callback missed
            if (payment && payment.status === "Pending") {
                payment.status = "Completed";
                await payment.save();

                const user = await User.findById(userId);
                if (user) {
                    user.balance += amount;
                    await user.save();
                    console.log(`Credited ₹${amount} to ${user.email} (Manual Status Check)`);
                }
            } else if (!payment) {
                 await Payment.create({
                    user_id: userId,
                    transaction_id: merchantTransactionId,
                    amount: amount,
                    status: "Completed"
                });
                const user = await User.findById(userId);
                if (user) {
                    user.balance += amount;
                    await user.save();
                }
            }

            return NextResponse.json({ 
                success: true, 
                payment_status: "Completed",
                manual_check: true
             });
        }

        return NextResponse.json({ 
            success: true, 
            payment_status: payment?.status || "Pending",
            manual_check: false
        });

    } catch (error: any) {
        console.error("Status check error:", error);
        return NextResponse.json({ message: "Status check error", error: error.message }, { status: 500 });
    }
}
