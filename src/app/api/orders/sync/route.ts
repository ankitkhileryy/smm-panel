import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Verify Authentication
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
        const decoded: any = jwt.verify(token, secret);
        if (!decoded.userId) return NextResponse.json({ message: "Invalid session" }, { status: 401 });

        const API_KEY = process.env.SMM_PROVIDER_KEY;
        const API_URL = process.env.SMM_PROVIDER_URL;

        if (!API_KEY || !API_URL) return NextResponse.json({ message: "Provider config missing" }, { status: 500 });

        // 2. Fetch User's Pending/Processing Orders
        const activeOrders = await Order.find({
            user_id: decoded.userId,
            status: { $in: ["Pending", "Processing", "In progress"] },
            provider_order_id: { $exists: true, $ne: null }
        }).limit(20); // Limit to avoid bombardment

        let updatedCount = 0;

        for (const order of activeOrders) {
            try {
                const formData = new URLSearchParams();
                formData.append("key", API_KEY);
                formData.append("action", "status");
                formData.append("order", order.provider_order_id.toString());

                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Origin": new URL(API_URL).origin,
                        "Referer": new URL(API_URL).origin + "/"
                    },
                    body: formData.toString()
                });
                const responseText = await res.text();
                let data: any = {};
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    if (responseText.includes("Cloudflare") || responseText.includes("<title>")) {
                        console.error("🚨 Cloudflare IP Block on orders/sync!");
                        // Skip updating this order as sync failed due to IP block
                        continue;
                    }
                    console.error("Invalid JSON from provider on sync. Response: " + responseText.substring(0, 100));
                    continue;
                }

                if (data.status) {
                    const oldStatus = order.status;

                    // Normalize provider status
                    let newStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase();
                    if (newStatus === "Inprogress") newStatus = "In progress";
                    if (newStatus === "Cancelled") newStatus = "Canceled";

                    order.status = newStatus as any;
                    const remains = parseInt(data.remains || "0");

                    // Auto-Refund if needed
                    if ((data.status === "Canceled" || data.status === "Partial" || data.status === "Refunded") && !order.refunded) {
                        const user = await User.findById(decoded.userId);
                        if (user) {
                            let refundAmount = 0;
                            if (data.status === "Canceled" || data.status === "Refunded") {
                                refundAmount = order.charge;
                            } else if (data.status === "Partial" && remains > 0) {
                                refundAmount = parseFloat(((remains / order.quantity) * order.charge).toFixed(2));
                            }
                            if (refundAmount > 0) {
                                user.balance += refundAmount;
                                await user.save();
                                order.refunded = true;
                            }
                        }
                    }

                    await order.save();
                    if (oldStatus !== data.status) updatedCount++;
                }
            } catch (e) { console.error(`Sync fail for ${order.provider_order_id}`, e); }
        }

        return NextResponse.json({ message: "Orders synced", updated: updatedCount });

    } catch (error: any) {
        return NextResponse.json({ message: "Sync failed", error: error.message }, { status: 500 });
    }
}
