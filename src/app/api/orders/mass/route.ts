import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import Service from "@/models/Service";
import jwt from "jsonwebtoken";

async function sendOrderToProvider(service: string, link: string, quantity: number) {
    const API_KEY = process.env.SMM_PROVIDER_KEY;
    const API_URL = process.env.SMM_PROVIDER_URL;
    if (!API_KEY || !API_URL) return { order: null, error: "System Configuration Error" };

    try {
        const formData = new URLSearchParams();
        formData.append("key", API_KEY);
        formData.append("action", "add");
        formData.append("service", service.toString());
        formData.append("link", link);
        formData.append("quantity", quantity.toString());

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

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
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            if (responseText.includes("Cloudflare") || responseText.includes("<title>")) {
                return { order: null, error: "Cloudflare is blocking Server IP" };
            }
            return { order: null, error: "Invalid JSON from Provider" };
        }

        return { order: data?.order || null, error: data?.error || null };
    } catch (err) {
        return { order: null, error: "Network Transport Failure" };
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
        const decoded: any = jwt.verify(token, secret);
        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { orders } = await req.json(); // Array of { service_id, link, quantity }
        if (!Array.isArray(orders)) return NextResponse.json({ message: "Invalid input" }, { status: 400 });

        let successCount = 0;
        let failCount = 0;
        let totalCharge = 0;

        for (const orderData of orders) {
            const { service_id, link, quantity } = orderData;
            const dbService = await Service.findOne({ service: service_id });
            if (!dbService) { failCount++; continue; }

            // Calculate rate with user custom margin if any
            const marginMultiplier = 1 + ((user.customMargin || 20) / 100); // Default to 20 if none
            const charge = parseFloat(((quantity / 1000) * dbService.provider_rate * marginMultiplier).toFixed(2));

            if (user.balance < charge) { failCount++; continue; }

            // Process order
            user.balance -= charge;
            await user.save();
            totalCharge += charge;

            const providerRes = await sendOrderToProvider(service_id, link, quantity);
            if (providerRes.error) {
                user.balance += charge;
                await user.save();
                failCount++;
                continue;
            }

            const newOrder = new Order({
                user_id: user._id,
                service_id,
                link,
                quantity,
                charge,
                status: "Processing",
                provider_order_id: providerRes?.order || null
            });
            await newOrder.save();
            successCount++;
        }

        return NextResponse.json({
            message: "Mass orders processed",
            success: successCount,
            failed: failCount,
            total_charge: totalCharge
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Error processing mass orders", error: error.message }, { status: 500 });
    }
}
