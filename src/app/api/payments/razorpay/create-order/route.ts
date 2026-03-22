import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongoose";

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || amount < 10) {
            return NextResponse.json({ message: "Invalid amount. Minimum is ₹10." }, { status: 400 });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ message: "Razorpay keys are missing." }, { status: 500 });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error creating order.", error: error.message }, { status: 500 });
    }
}
