import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import Service from "@/models/Service";
import AffiliateTransaction from "@/models/AffiliateTransaction";

// Placeholder for the external SMM Provider API integration
// e.g. An external panel like NativeSmm or JustAnotherPanel
// Actual SMM Provider API integration
async function sendOrderToProvider(service: string, link: string, quantity: number, runs?: number, interval?: number) {
    const API_KEY = process.env.SMM_PROVIDER_KEY;
    const API_URL = process.env.SMM_PROVIDER_URL;

    if (!API_KEY || !API_URL) {
        console.error("❌ Provider Configuration Missing");
        return { order: null, error: "System Configuration Error" };
    }

    try {
        const formData = new URLSearchParams();
        formData.append("key", API_KEY);
        formData.append("action", "add");
        formData.append("service", service.toString());
        formData.append("link", link);
        formData.append("quantity", quantity.toString());

        if (runs && interval) {
            formData.append("runs", runs.toString());
            formData.append("interval", interval.toString());
        }

        // Log sanitized call
        console.log(`🌐 System: Calling Provider Node -> ${API_URL} (action=add&service=${service})`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Origin": new URL(API_URL).origin,
                "Referer": new URL(API_URL).origin + "/"
            },
            body: formData.toString(),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseText = await res.text();

        try {
            const data = JSON.parse(responseText);
            return { order: data?.order || null, error: data?.error || null };
        } catch (jsonErr: any) {
            console.error("🚨 Provider JSON Parse Error:", responseText.substring(0, 500));
            if (responseText.includes("Cloudflare") || responseText.includes("<title>")) {
                return { order: null, error: "Cloudflare is blocking Server IP. Contact Provider." };
            }
            return { order: null, error: "Invalid JSON from Provider" };
        }

    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.error("⏳ Provider Link Timeout: The external node took too long to respond.");
            return { order: null, error: "Provider Connection Timeout" };
        }
        console.error("🚨 Provider Pipeline Failure:", err.message);
        return { order: null, error: "Network Transport Failure" };
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Verify Authentication
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);

        if (!decoded.userId) {
            return NextResponse.json({ message: "Invalid session" }, { status: 401 });
        }

        const { service_id, link, quantity, runs, interval } = await req.json();

        // 2. Fetch Service for Price Verification
        const dbService = await Service.findOne({ service: service_id });
        if (!dbService) {
            return NextResponse.json({ message: "Service not found or inactive" }, { status: 404 });
        }

        const qty = parseInt(quantity as string, 10);
        if (isNaN(qty) || qty < dbService.min || qty > dbService.max || qty <= 0) {
            return NextResponse.json({ message: `Invalid quantity. Must be between ${dbService.min} and ${dbService.max}.` }, { status: 400 });
        }

        const calculatedCharge = parseFloat(((qty / 1000) * dbService.rate).toFixed(2));

        // 2. Fetch User and Check Balance
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.balance < calculatedCharge) {
            return NextResponse.json({ message: "Insufficient balance. Please add funds." }, { status: 400 });
        }

        // 3. Deduct Balance
        user.balance -= calculatedCharge;
        const charge = calculatedCharge; // Override charge with verified backend price
        await user.save();

        // 4. Send Order to External SMM Provider API
        const providerRes = await sendOrderToProvider(service_id, link, qty, runs, interval);

        if (providerRes.error) {
            // Refund the user if the provider API fails
            user.balance += charge;
            await user.save();
            return NextResponse.json({ message: "Provider Error: " + providerRes.error }, { status: 400 });
        }

        // 5. Create Order Record in DB
        const newOrder = new Order({
            user_id: user._id,
            service_id,
            link,
            quantity: qty,
            charge,
            status: "Processing",
            provider_order_id: providerRes?.order || null,
            runs,
            interval
        });

        await newOrder.save();

        // 🏆 AFFILIATE COMMISSION LOGIC
        if (user.referredBy) {
            try {
                const commissionRate = 0.05; // 5% Commission
                const commissionAmount = parseFloat((charge * commissionRate).toFixed(2));

                if (commissionAmount > 0) {
                    await User.findByIdAndUpdate(user.referredBy, {
                        $inc: { affiliateBalance: commissionAmount }
                    });

                    const affTrans = new AffiliateTransaction({
                        user_id: user.referredBy,
                        referred_user_id: user._id,
                        order_id: newOrder._id,
                        amount: commissionAmount,
                        percentage: 5
                    });
                    await affTrans.save();
                }
            } catch (affErr) {
                console.error("Affiliate Credit Failed:", affErr);
            }
        }

        return NextResponse.json({ message: "Order placed successfully", order: newOrder }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error processing order", error: error.message }, { status: 500 });
    }
}
export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Verify Authentication
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);

        if (!decoded.userId) {
            return NextResponse.json({ message: "Invalid session" }, { status: 401 });
        }

        // 2. Fetch Orders for User
        const orders = await Order.find({ user_id: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching orders", error: error.message }, { status: 500 });
    }
}
