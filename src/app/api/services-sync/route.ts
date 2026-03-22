import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Service from "@/models/Service";

export async function GET() {
    try {
        await dbConnect();
        // Fetch from our local DB which has the Admin's custom margin applied
        const services = await Service.find({ status: "Active" }).sort("category name");
        return NextResponse.json(services);
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching services", error: error.message }, { status: 500 });
    }
}
