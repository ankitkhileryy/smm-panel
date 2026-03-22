export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Service from "@/models/Service";
import User from "@/models/User";
import Settings from "@/models/Settings";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Fetch ALL services (we need provider_rate for calculation)
        const services = await Service.find({ status: "Active" }).sort("category name").lean();

        const cookieHeader = req.headers.get("cookie");

        // 2. Perform background auto-sync if older than 10 minutes
        let settings = await Settings.findOne().lean();
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        if (!settings?.lastSyncAt || new Date(settings.lastSyncAt) < tenMinutesAgo) {
            console.log("🔄 FORCED SYNC: Price data is more than 10 mins old.");
            fetch(new URL('/api/admin/sync-services', req.url).toString(), {
                method: 'POST',
                headers: cookieHeader ? { 'cookie': cookieHeader } : {},
            }).catch(e => console.error("Auto rate sync failed", e));
        } else if (Math.random() < 0.1) {
            // Still do a random sync for extra safety (1 in 10 requests)
            fetch(new URL('/api/admin/sync-services', req.url).toString(), {
                method: 'POST',
                headers: cookieHeader ? { 'cookie': cookieHeader } : {},
            }).catch(e => console.error("Auto rate sync failed", e));
        }

        // 3. Sanitize (Remove provider_rate)
        const formattedServices = services.map((s: any) => {
            // Rate is already synced with flat ₹15 markup in sync-services
            const { provider_rate, ...cleanService } = s;
            return cleanService;
        });

        return NextResponse.json(formattedServices);
    } catch (error: any) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ message: "Failed to fetch services", error: error.message }, { status: 500 });
    }
}
