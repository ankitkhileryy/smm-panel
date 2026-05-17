import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Service from "@/models/Service";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        const { orders } = await req.json(); // Array of { serviceId, link, quantity }

        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            return NextResponse.json({ message: "No orders provided" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId;

        await dbConnect();
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        let totalCharge = 0;
        const processedOrders = [];
        const errors = [];

        for (const orderData of orders) {
            const { serviceId, link, quantity } = orderData;
            
            if (!serviceId || !link || !quantity) {
                errors.push({ order: orderData, error: "Missing parameters" });
                continue;
            }

            const service = await Service.findOne({ service: serviceId });
            if (!service) {
                errors.push({ order: orderData, error: `Service ${serviceId} not found` });
                continue;
            }

            if (quantity < service.min || quantity > service.max) {
                 errors.push({ order: orderData, error: `Quantity must be between ${service.min} and ${service.max}` });
                 continue;
            }

            const charge = parseFloat(((quantity / 1000) * parseFloat(service.rate)).toFixed(2));
            totalCharge += charge;
            processedOrders.push({ serviceId, link, quantity, charge });
        }

        if (user.balance < totalCharge) {
            return NextResponse.json({ message: "Insufficient balance for all orders" }, { status: 400 });
        }

        // Deduct and Save
        user.balance -= totalCharge;
        await user.save();

        const savedOrders = await Order.insertMany(processedOrders.map(o => ({
            user_id: userId,
            service_id: o.serviceId,
            link: o.link,
            quantity: o.quantity,
            charge: o.charge,
            status: "Pending"
        })));

        return NextResponse.json({ 
            message: `Successfully placed ${savedOrders.length} orders.`,
            successCount: savedOrders.length,
            errors 
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Mass order error", error: error.message }, { status: 500 });
    }
}
