export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Settings from "@/models/Settings";

export async function GET() {
    try {
        await dbConnect();
        const settings = await Settings.findOne();
        if (!settings) return NextResponse.json({ profitMargin: 20, maintenanceMode: false, broadcastMessage: "" });

        // Return only "safe" public settings
        return NextResponse.json({
            profitMargin: settings.profitMargin,
            maintenanceMode: settings.maintenanceMode,
            broadcastMessage: settings.broadcastMessage,
            themeColor: settings.themeColor || "#2563eb"
        });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
    }
}
