import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/models/Ticket";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { message, status } = await req.json();
        const { id } = params;

        await dbConnect();
        const ticket = await Ticket.findById(id);
        if (!ticket) return NextResponse.json({ message: "Ticket not found" }, { status: 404 });

        if (message) {
            ticket.messages.push({
                sender: "Admin",
                message,
                createdAt: new Date()
            });
            // Auto update status if message provided
            if (!status) ticket.status = "Answered";
        }

        if (status) ticket.status = status;
        
        ticket.updatedAt = new Date();
        await ticket.save();

        return NextResponse.json({ message: "Update successful", ticket });

    } catch (error: any) {
        return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
    }
}
