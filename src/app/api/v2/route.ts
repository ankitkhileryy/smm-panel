import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Service from "@/models/Service";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json().catch(() => null);

        // Handle both JSON and Form Data (SMM standard)
        const params = body || Object.fromEntries(new URLSearchParams(await req.text()));
        const { key, action } = params;

        if (!key) return NextResponse.json({ error: "API key is required" }, { status: 401 });

        const user = await User.findOne({ apiKey: key });
        if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

        switch (action) {
            case "balance":
                return NextResponse.json({
                    balance: user.balance.toFixed(2),
                    currency: "INR"
                });

            case "services":
                const services = await Service.find({ status: "Active" });
                return NextResponse.json(services.map(s => ({
                    service: s.service,
                    name: s.name,
                    type: s.type,
                    category: s.category,
                    rate: s.rate,
                    min: s.min,
                    max: s.max
                })));

            case "add":
                const { service, link, quantity } = params;
                if (!service || !link || !quantity) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

                const dbService = await Service.findOne({ service });
                if (!dbService) return NextResponse.json({ error: "Service not found" }, { status: 400 });

                const charge = parseFloat(((quantity / 1000) * dbService.rate).toFixed(2));
                if (user.balance < charge) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

                // Deduction and Order Placement logic (Simplified for API v2)
                user.balance -= charge;
                await user.save();

                const newOrder = new Order({
                    user_id: user._id,
                    service_id: service,
                    link,
                    quantity,
                    charge,
                    status: "Pending"
                });
                await newOrder.save();

                return NextResponse.json({ order: newOrder._id });

            case "status":
                const { order } = params;
                if (!order) return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
                const dbOrder = await Order.findById(order);
                if (!dbOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

                return NextResponse.json({
                    status: dbOrder.status,
                    charge: dbOrder.charge.toFixed(2),
                    start_count: 0,
                    remains: dbOrder.quantity,
                    currency: "INR"
                });

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", detail: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    return NextResponse.json({ error: "Post method required for SMM API v2" }, { status: 405 });
}
