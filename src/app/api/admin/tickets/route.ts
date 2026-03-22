import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/models/Ticket";

export async function GET() {
    try {
        await dbConnect();
        // Fetch all tickets for admin, including user info
        const tickets = await Ticket.find().populate("user_id", "email").sort("-updatedAt");
        return NextResponse.json(tickets);
    } catch (error: any) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}
