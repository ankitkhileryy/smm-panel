export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Settings from "@/models/Settings";
import { generateChecksum } from "@/lib/phonepe-utils";

const DEFAULT_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const DEFAULT_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const DEFAULT_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const API_URL = process.env.PHONEPE_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        // Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId;

        await dbConnect();
        
        // Fetch Settings for PhonePe Credentials
        const settings = await Settings.findOne();
        const MERCHANT_ID = settings?.phonepeMerchantId || DEFAULT_MERCHANT_ID;
        const SALT_KEY = settings?.phonepeSaltKey || DEFAULT_SALT_KEY;
        const SALT_INDEX = settings?.phonepeSaltIndex || DEFAULT_SALT_INDEX;

        if (!MERCHANT_ID || !SALT_KEY) {
             return NextResponse.json({ message: "PhonePe credentials not configured" }, { status: 500 });
        }

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const merchantTransactionId = `T${Date.now()}`;
        
        // Create initial pending payment record
        await Payment.create({
            user_id: userId,
            transaction_id: merchantTransactionId,
            amount: amount,
            status: "Pending"
        });

        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: userId.toString(), 
            amount: amount * 100, // in paise
            redirectUrl: `${APP_URL}/dashboard/add-funds?status=check&id=${merchantTransactionId}`,
            redirectMode: "REDIRECT",
            callbackUrl: `${APP_URL}/api/payments/phonepe/callback`,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
        const checksum = generateChecksum(payload, "/pg/v1/pay", SALT_KEY, SALT_INDEX);

        const response = await fetch(`${API_URL}/pg/v1/pay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "accept": "application/json"
            },
            body: JSON.stringify({ request: base64Payload })
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({ 
                url: data.data.instrumentResponse.redirectInfo.url,
                merchantTransactionId: merchantTransactionId
            });
        } else {
            console.error("PhonePe Initiation Failed:", data);
            return NextResponse.json({ message: "PhonePe Initiation Failed", error: data }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Initiate error:", error);
        return NextResponse.json({ message: "Payment initiation error", error: error.message }, { status: 500 });
    }
}
