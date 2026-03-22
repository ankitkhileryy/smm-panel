"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setMaintenanceMode(data.maintenanceMode);
                }
            } catch (e) {
                console.error("Maintenance check failed");
            } finally {
                setLoading(false);
            }
        };

        checkMaintenance();
    }, []);

    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
        } catch (e) {
            console.error("Logout failed");
        }
    };

    if (loading || authLoading) return children;

    // Skip maintenance check for login and related auth pages
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/";
    if (isAuthPage) return children;

    // If maintenance is ON and user is NOT an admin, show maintenance page
    if (maintenanceMode && user?.role !== "admin") {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8 text-center font-sans overflow-hidden italic selection:bg-red-900/30">
                {/* Minimal Background Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.12)_0%,transparent_70%)] animate-pulse italic"></div>

                <div className="relative flex flex-col items-center gap-12 text-center italic">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-7xl md:text-[140px] font-black text-white tracking-tighter uppercase italic leading-none"
                    >
                        SMM<span className="text-[#b91c1c] italic">12</span>
                    </motion.h1>

                    <div className="space-y-8 italic">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none opacity-40">
                           OFFLINE <span className="text-[#b91c1c] italic">MODE</span>
                        </h2>
                        
                        <p className="text-slate-900 text-[10px] md:text-[12px] font-black leading-relaxed uppercase tracking-[0.6em] md:tracking-[0.8em] italic leading-none animate-pulse">
                            AWAITING SYSTEM SIGNAL...
                        </p>

                        <div className="pt-12 italic">
                            <button
                                onClick={handleLogout}
                                className="px-12 py-5 bg-[#0a0a0c] hover:bg-[#b91c1c] text-[#b91c1c] hover:text-white rounded-[24px] md:rounded-[32px] text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] border border-white/5 transition-all shadow-2xl active:scale-95 italic leading-none"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
