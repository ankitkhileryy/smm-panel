export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Settings from "@/models/Settings";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({ profitMargin: 20 });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();
        const body = await req.json();
        
        // Remove undefined fields to avoid overwriting with null
        const updateData: any = {};
        if (body.profitMargin !== undefined) updateData.profitMargin = body.profitMargin;
        if (body.adminEmail !== undefined) updateData.adminEmail = body.adminEmail;
        if (body.maintenanceMode !== undefined) updateData.maintenanceMode = body.maintenanceMode;
        if (body.broadcastMessage !== undefined) updateData.broadcastMessage = body.broadcastMessage;
        if (body.themeColor !== undefined) updateData.themeColor = body.themeColor;
        if (body.phonepeMerchantId !== undefined) updateData.phonepeMerchantId = body.phonepeMerchantId;
        if (body.phonepeSaltKey !== undefined) updateData.phonepeSaltKey = body.phonepeSaltKey;
        if (body.phonepeSaltIndex !== undefined) updateData.phonepeSaltIndex = body.phonepeSaltIndex;

        const settings = await Settings.findOneAndUpdate(
            {},
            { $set: updateData },
            { upsert: true, returnDocument: 'after' }
        );

        return NextResponse.json({ message: "Settings updated", settings });
    } catch (error) {
        return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }
}
