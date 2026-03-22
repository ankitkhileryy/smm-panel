"use client";

import { useEffect, useState } from "react";
import { Bell, Activity, Send } from "lucide-react";

export default function BroadcastMarquee() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setMessage(data.broadcastMessage || "");
                }
            } catch (e) {
                console.error("Failed to fetch broadcast message");
            }
        };

        fetchSettings();
    }, []);

    if (!message) return null;

    return (
        <div className="bg-[#b91c1c] text-white h-12 w-full flex-shrink-0 shadow-2xl overflow-hidden relative flex items-center z-[50] border-b border-red-950/20 italic">
            <div className="flex items-center gap-4 bg-[#050505] h-full px-8 text-[10px] font-black uppercase tracking-[0.4em] z-20 shrink-0 shadow-2xl border-r border-white/5 skew-x-[-12deg] -ml-4">
                <div className="skew-x-[12deg] flex items-center gap-3">
                    <Activity className="w-4 h-4 text-[#b91c1c] animate-pulse" />
                    <span className="hidden sm:inline">GLOBAL_SIGNAL</span>
                    <span className="sm:hidden">ALRT</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap relative">
                <div className="inline-block animate-marquee whitespace-nowrap will-change-transform">
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] px-12 inline-block">
                        • {message} •
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] px-12 inline-block">
                        • {message} •
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] px-12 inline-block">
                        • {message} •
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
