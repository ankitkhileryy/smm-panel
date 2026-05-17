import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId;

        await dbConnect();
        
        const payments = await Payment.find({ user_id: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(payments);

    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
