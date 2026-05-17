import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/models/Ticket";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, secret);
        const { message } = await req.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) return NextResponse.json({ message: "Ticket not found" }, { status: 404 });

        // Ensure user owns this ticket or is admin
        const isAdmin = decoded.role === "admin";
        if (!isAdmin && ticket.user_id.toString() !== decoded.userId) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        ticket.messages.push({
            sender: isAdmin ? "Admin" : "User",
            message
        });

        ticket.status = isAdmin ? "Answered" : "Pending";
        await ticket.save();

        return NextResponse.json(ticket);
    } catch (error: any) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}
