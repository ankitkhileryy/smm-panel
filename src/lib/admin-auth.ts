import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const ADMIN_EMAIL = "ankitbishnoi9928154849@gmail.com";

export async function isAdmin() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return false;

        const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
        const decoded: any = jwt.verify(token, secret);

        await dbConnect();
        const user = await User.findById(decoded.userId).select("role email");

        if (user && user.role === "admin" && user.email.toLowerCase() === ADMIN_EMAIL) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}
