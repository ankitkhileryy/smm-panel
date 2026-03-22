import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

import { isAdmin } from "@/lib/admin-auth";

export async function POST() {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();

        const API_KEY = process.env.SMM_PROVIDER_KEY;
        const API_URL = process.env.SMM_PROVIDER_URL;

        if (!API_KEY || !API_URL) return NextResponse.json({ message: "Config missing" }, { status: 500 });

        // 1. Get orders to sync
        const activeOrders = await Order.find({
            status: { $in: ["Pending", "Processing", "In progress"] },
            provider_order_id: { $exists: true, $ne: null }
        }).limit(50);

        let syncedCount = 0;
        let refundCount = 0;

        for (const order of activeOrders) {
            try {
                const formData = new URLSearchParams();
                formData.append("key", API_KEY);
                formData.append("action", "status");
                formData.append("order", order.provider_order_id.toString());

                // Fetch status from provider
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
                        console.error("🚨 Cloudflare IP Block on admin/sync-orders!");
                        // Skip updating this order
                        continue;
                    }
                    console.error("Invalid JSON from provider on order status sync. Response: " + responseText.substring(0, 100));
                    continue;
                }

                if (data.status) {
                    const oldStatus = order.status;
                    // Normalize provider status
                    let newStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase();
                    if (newStatus === "Inprogress") newStatus = "In progress";
                    if (newStatus === "Cancelled") newStatus = "Canceled";

                    const remains = parseInt(data.remains || "0");

                    // Update order status
                    order.status = newStatus as any;

                    // Auto-Refund Logic
                    if ((newStatus === "Canceled" || newStatus === "Partial" || newStatus === "Refunded") && !order.refunded) {
                        const user = await User.findById(order.user_id);
                        if (user) {
                            let refundAmount = 0;
                            if (newStatus === "Canceled" || newStatus === "Refunded") {
                                refundAmount = order.charge;
                            } else if (newStatus === "Partial" && remains > 0) {
                                // Calculate proportional refund
                                refundAmount = parseFloat(((remains / order.quantity) * order.charge).toFixed(2));
                            }

                            if (refundAmount > 0) {
                                user.balance += refundAmount;
                                await user.save();
                                order.refunded = true;
                                refundCount++;
                                console.log(`[Auto-Refund] Refunded ₹${refundAmount} to ${user.email} for order ${order._id}`);
                            }
                        }
                    }

                    await order.save();
                    if (oldStatus !== newStatus) syncedCount++;
                }
            } catch (err) {
                console.error(`Status sync failed for order ${order.provider_order_id}`, err);
            }
        }

        return NextResponse.json({
            message: "Order sync and auto-refund completed",
            synced: syncedCount,
            refunds: refundCount
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Sync failed", error: error.message }, { status: 500 });
    }
}
