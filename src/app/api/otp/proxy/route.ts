import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const API_KEY = process.env.DGOTP_API_KEY;
const BASE_URL = "https://dgotp.shop/stubs/handler_api.php";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        if (!API_KEY) {
            return NextResponse.json({ message: "DGOTP API key is missing." }, { status: 500 });
        }

        if (!action) {
            return NextResponse.json({ message: "Action is required." }, { status: 400 });
        }

        // Logic for getNumber (Requires Balance Deduction)
        if (action === "getNumber") {
            await dbConnect();
            const cookieHeader = req.headers.get("cookie");
            const token = cookieHeader?.split("auth_token=")[1]?.split(";")[0];

            if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
            const decoded: any = jwt.verify(token, secret);
            const user = await User.findById(decoded.userId);
            if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

            const service = searchParams.get("service");
            const server = searchParams.get("server");

            // 1. Fetch price from DGOTP
            const svcRes = await fetch(`${BASE_URL}?api_key=${API_KEY}&action=getServices`);
            const svcData = await svcRes.json();

            const serviceOptions = svcData[service || ""];
            const option = serviceOptions?.find((o: any) => o.server_code === server);

            if (!option) {
                return NextResponse.json({ message: "Service or Server not available" }, { status: 400 });
            }

            const systemPrice = parseFloat(option.price);
            const userPrice = systemPrice * 1.03; // 3% margin

            if (user.balance < userPrice) {
                return new Response("ERROR_NO_BALANCE", { status: 200 }); // Compatible with DGOTP error format
            }

            // 2. Call DGOTP buy
            const buyUrl = `${BASE_URL}?api_key=${API_KEY}&action=getNumber&service=${service}&server=${server}`;
            const buyRes = await fetch(buyUrl);
            const buyText = await buyRes.text();

            if (buyText.startsWith("ACCESS_NUMBER")) {
                // 3. Deduct balance
                user.balance -= userPrice;
                await user.save();
                return new Response(buyText, { status: 200 });
            }

            return new Response(buyText, { status: 200 });
        }

        // Default Proxy behavior
        let url = `${BASE_URL}?api_key=${API_KEY}&action=${action}`;
        if (searchParams.has("service")) url += `&service=${searchParams.get("service")}`;
        if (searchParams.has("server")) url += `&server=${searchParams.get("server")}`;
        if (searchParams.has("id")) url += `&id=${searchParams.get("id")}`;
        if (searchParams.has("status")) url += `&status=${searchParams.get("status")}`;

        const res = await fetch(url);
        const text = await res.text();

        try {
            const data = JSON.parse(text);
            if (action === "getServices") {
                const margin = 1.03;
                const optimizedData: any = {};
                for (const serviceName in data) {
                    optimizedData[serviceName] = data[serviceName].map((item: any) => ({
                        ...item,
                        price: (parseFloat(item.price) * margin).toFixed(2)
                    }));
                }
                return NextResponse.json(optimizedData);
            }
            return NextResponse.json(data);
        } catch (e) {
            return new Response(text, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json({ message: "OTP API Error", error: error.message }, { status: 500 });
    }
}
