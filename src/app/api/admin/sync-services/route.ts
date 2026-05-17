import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Service from "@/models/Service";
import Settings from "@/models/Settings";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();
        
        // Remove all old services before syncing new ones from the new provider
        await Service.deleteMany({});

        // Fetch from Provider
        const PROVIDER_URL = process.env.SMM_PROVIDER_URL;
        const PROVIDER_KEY = process.env.SMM_PROVIDER_KEY;

        if (!PROVIDER_URL || !PROVIDER_KEY) {
            return NextResponse.json({ message: "Provider credentials missing" }, { status: 500 });
        }

        const formData = new URLSearchParams();
        formData.append("key", PROVIDER_KEY);
        formData.append("action", "services");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(PROVIDER_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Origin": new URL(PROVIDER_URL).origin,
                "Referer": new URL(PROVIDER_URL).origin + "/"
            },
            body: formData.toString(),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const responseText = await response.text();
        let providerServices;
        try {
            providerServices = JSON.parse(responseText);
        } catch (e) {
            console.error("Parse Error. Response was:", responseText.substring(0, 300));
            if (responseText.includes("Cloudflare") || responseText.includes("<title>")) {
                return NextResponse.json({ message: `SMM Provider's Cloudflare is blocking the server IP. Please contact mysmmapi.com support to whitelist your server IP.` }, { status: 500 });
            }
            return NextResponse.json({ message: "Invalid JSON from provider" }, { status: 500 });
        }

        if (!Array.isArray(providerServices)) {
            return NextResponse.json({ message: "Invalid provider response" }, { status: 500 });
        }

        // Process and Sync
        let updatedCount = 0;
        for (const s of providerServices) {
            const providerRate = parseFloat(s.rate);

            // Apply flat ₹15 markup
            const margin = 15;
            const finalRate = parseFloat((providerRate + margin).toFixed(2));

            await Service.findOneAndUpdate(
                { service: s.service },
                {
                    name: s.name,           // EXACT SAME NAME AS PROVIDER
                    category: s.category,   // EXACT SAME CATEGORY AS PROVIDER
                    type: s.type,
                    min: parseInt(s.min),
                    max: parseInt(s.max),
                    rate: finalRate,
                    provider_rate: providerRate,
                    status: "Active"
                },
                { upsert: true, returnDocument: 'after' }
            );
            updatedCount++;
        }

        // Update Sync Timestamp
        await Settings.findOneAndUpdate({}, { lastSyncAt: new Date() }, { upsert: true });

        return NextResponse.json({
            message: "Success: Applied flat ₹15 margin and synced exact names",
            count: updatedCount,
            marginApplied: "Flat ₹15",
            lastSyncAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("Sync Error:", error);
        return NextResponse.json({ message: "Sync failed", error: error.message }, { status: 500 });
    }
}
