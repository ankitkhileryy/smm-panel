import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/models/Ticket";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

// 🔍 GET ALL TICKETS FOR LOGGED IN USER
export async function GET(req: Request) {
    try {
        await dbConnect();
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, secret);
        const tickets = await Ticket.find({ user_id: decoded.userId }).sort("-updatedAt");
        return NextResponse.json(tickets);
    } catch (error: any) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}

// ➕ CREATE NEW TICKET
export async function POST(req: Request) {
    try {
        await dbConnect();
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, secret);
        const { subject, request, message, order_id } = await req.json();

        const newTicket = new Ticket({
            user_id: decoded.userId,
            subject,
            request,
            order_id,
            messages: [{ sender: "User", message }]
        });

        await newTicket.save();
        return NextResponse.json(newTicket, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}
