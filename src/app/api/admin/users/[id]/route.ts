import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

import { isAdmin } from "@/lib/admin-auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        await dbConnect();
        const { customMargin } = await req.json();

        const user = await User.findByIdAndUpdate(
            params.id,
            { customMargin },
            { new: true }
        );

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "User margin updated", user });
    } catch (error: any) {
        return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
    }
}
