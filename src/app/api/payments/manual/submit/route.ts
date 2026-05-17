import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Payment from "@/models/Payment";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Authenticate User
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);

        const { amount, transaction_id } = await req.json();

        if (!amount || !transaction_id) {
            return NextResponse.json({ message: "Amount and Transaction ID are required" }, { status: 400 });
        }

        // 2. Check if Transaction ID already used
        const existingPayment = await Payment.findOne({ transaction_id });
        if (existingPayment) {
            return NextResponse.json({ message: "Wait! This Transaction ID has already been submitted or used." }, { status: 409 });
        }

        // 3. Create a Pending Payment Record
        const newPayment = new Payment({
            user_id: decoded.userId,
            amount: parseFloat(amount),
            transaction_id: transaction_id,
            status: "Pending"
        });

        await newPayment.save();

        /* 
           AUTOMATION NOTE: 
           In a real production environment, here you would call your UPI Gateway API 
           (e.g., Paytm Business API or a third-party gateway like upigateway.com)
           to verify if 'transaction_id' is valid for 'amount'.
           
           Example (Hypothetical):
           const verificationResult = await verifyUPI(transaction_id, amount);
           if (verificationResult.success) {
               newPayment.status = "Completed";
               // ... add balance to user
           }
        */

        // For now, we will simulate a "Submission Received" response. 
        // If the user wants INSTANT automated credit, they must provide their Gateway API keys.

        return NextResponse.json({
            message: "Transaction ID submitted successfully. Our team will verify and add funds within 5-10 minutes.",
            paymentId: newPayment._id
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: "Payment submission failed", error: error.message }, { status: 500 });
    }
}
