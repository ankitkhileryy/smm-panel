"use client";

import DashboardSidebar from "@/components/dashboard-sidebar";
import BroadcastMarquee from "@/components/BroadcastMarquee";
import SplashScreen from "@/components/SplashScreen";
import { User, Bell, ChevronDown, Wallet, ShoppingCart, PlayCircle, Zap, TrendingUp, Info, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden italic">
                <SplashScreen />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-red-900/30 overflow-x-hidden text-slate-400 italic">
            <SplashScreen sessionKey="dashboard_entry_splash" />
            <DashboardSidebar />

            <main className="flex-1 flex flex-col md:pl-[240px] min-h-screen relative pt-[70px] md:pt-0 italic">
                <BroadcastMarquee />

                {/* Top Header */}
                <header className="sticky top-0 z-40 px-8 bg-[#050505]/60 md:flex items-center justify-end hidden border-b border-white/[0.03] h-[70px] backdrop-blur-2xl italic">
                    <div className="flex items-center gap-8 italic">
                        <div className="flex items-center group italic">
                            <div className="bg-[#0c0c0e] border border-white/[0.05] text-white px-5 py-2.5 rounded-2xl text-[13px] font-black flex items-center gap-3 shadow-2xl transition-all hover:border-[#b91c1c]/20 italic shadow-inner">
                                <Wallet className="w-4 h-4 text-[#b91c1c] italic" />
                                <span className="tracking-tighter italic">₹{user.balance?.toFixed(4) || "0.0000"}</span>
                                <div className="w-px h-4 bg-white/[0.05] mx-1 italic"></div>
                                <ChevronDown className="w-3.5 h-3.5 opacity-30 group-hover:text-[#b91c1c] transition-colors italic" />
                            </div>
                        </div>
                        <Link href="/dashboard/account" className="text-[11px] font-black text-slate-800 hover:text-white uppercase tracking-[0.2em] transition-all italic">
                            Account
                        </Link>
                        <button
                            onClick={async () => {
                                await fetch("/api/auth/logout", { method: "POST" });
                                window.location.href = "/";
                            }}
                            className="text-[11px] font-black text-slate-800 hover:text-[#b91c1c] uppercase tracking-[0.2em] transition-all italic"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex-1 px-4 py-6 md:px-10 md:py-10 bg-[#050505] italic">
                    <div className="max-w-[1400px] mx-auto italic">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="italic"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Bottom Spacing for navigation */}
                <div className="md:hidden h-24 italic"></div>
            </main>
        </div>
    );
}
