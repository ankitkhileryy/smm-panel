import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function isAdmin() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return false;

        const secret = process.env.JWT_SECRET;
        if (!secret) return false;
        const decoded: any = jwt.verify(token, secret);

        await dbConnect();
        const user = await User.findById(decoded.userId).select("role email");

        if (user && user.role === "admin") {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}
