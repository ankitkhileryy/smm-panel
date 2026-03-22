"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ListFilter,
    History,
    Wallet,
    Menu,
    X,
    LogOut,
    MessageCircle,
    Smartphone,
    Share2,
    Headset,
    ShieldCheck,
    Users,
    User,
    CreditCard,
    ShieldAlert,
    Palette,
    Terminal,
    Activity,
    Shield
} from "lucide-react";

const navGroups = [
    {
        title: "MAIN MENU",
        items: [
            { name: "New Order", href: "/dashboard", icon: LayoutDashboard },
            { name: "Order History", href: "/dashboard/history", icon: History },
            { name: "Add Funds", href: "/dashboard/add-funds", icon: Wallet },
            { name: "Services", href: "/dashboard/services", icon: ListFilter },
            { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldAlert, adminOnly: true },
        ]
    },
    {
        title: "TOOLS",
        items: [
            { name: "OTP Services", href: "/dashboard/otp", icon: Smartphone },
            { name: "API Docs", href: "/api-docs", icon: Terminal },
            { name: "Support", href: "/dashboard/support", icon: Headset },
            { name: "Our Team", href: "/dashboard/team", icon: Users },
            { name: "Affiliates", href: "/dashboard/affiliate", icon: Share2 },
            { name: "Account", href: "/dashboard/account", icon: User },
        ]
    }
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
        } catch (err) {
            router.push("/");
        }
    };

    const getIconColor = (name: string) => {
        if (name.includes("New") || name.includes("Admin") || name.includes("Funds")) return "bg-[#b91c1c]";
        if (name.includes("Order History") || name.includes("API Docs")) return "bg-[#0a0a0c]";
        if (name.includes("Affiliates") || name.includes("Team")) return "bg-[#b91c1c]/40";
        if (name.includes("Account") || name.includes("Support")) return "bg-[#050505]";
        return "bg-slate-900"; 
    };

    return (
        <>
            {/* Mobile Header */}
            <div className={`md:hidden fixed top-0 left-0 w-full h-[70px] bg-[#050505] border-b border-white/[0.03] flex items-center justify-between px-8 z-[55] ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-800 hover:text-[#b91c1c] transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="w-9 h-9 rounded-2xl bg-[#0a0a0c] border border-white/5 text-[#b91c1c] flex justify-center items-center shadow-2xl">
                        <Shield className="w-5 h-5 italic" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-white italic">SMM<span className="text-[#b91c1c]">12</span></span>
                </div>
            </div>

            {/* Sidebar Container */}
            <AnimatePresence>
                {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                    <motion.aside 
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed top-0 left-0 h-full w-[280px] z-[60] bg-[#0a0a0c] border-r border-white/5 overflow-y-auto flex flex-col shadow-2xl md:shadow-none font-sans`}
                    >

                        {/* Brand Header */}
                        <div className="h-[100px] flex items-center justify-between px-10 shrink-0 pt-6">
                            <Link href="/dashboard" className="flex items-center gap-5 group">
                                <div 
                                    className="w-11 h-11 rounded-[22px] bg-[#050505] border border-white/5 text-[#b91c1c] flex justify-center items-center shadow-2xl transition-all group-hover:border-[#b91c1c]/30 shadow-inner"
                                >
                                    <Shield className="w-6 h-6 italic" />
                                </div>
                                <span className="text-3xl font-black tracking-tighter uppercase text-white group-hover:text-[#b91c1c] transition-colors italic leading-none">SMM<span className="text-[#b91c1c]">12</span></span>
                            </Link>
                            <button onClick={toggleSidebar} className="md:hidden p-2 text-slate-800 hover:text-white">
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="flex-1 py-10 px-8">
                            {/* Navigation Groups */}
                            <div className="space-y-14">
                                {navGroups.map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-8">
                                        <h3 className="px-5 text-[10px] font-black uppercase tracking-[0.6em] text-slate-900 italic leading-none">{group.title}</h3>
                                        <div className="space-y-4">
                                            {group.items.map((item: any) => {
                                                if (item.adminOnly && user?.role !== "admin") return null;
                                                const isActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block"
                                                    >
                                                        <div
                                                            className={`flex items-center gap-5 px-5 py-4.5 rounded-[22px] transition-all duration-300 ${isActive ? 'bg-[#b91c1c]/5 text-white border border-[#b91c1c]/10 shadow-inner' : 'text-slate-700 hover:bg-white/[0.02] hover:text-white border border-transparent'} font-black relative overflow-hidden group`}
                                                        >
                                                            {isActive && (
                                                                <motion.div 
                                                                    layoutId="activeNav"
                                                                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#b91c1c]" 
                                                                />
                                                            )}
                                                            <div className={`w-10 h-10 rounded-[18px] flex items-center justify-center text-white shadow-2xl shrink-0 ${getIconColor(item.name)} ${isActive ? 'opacity-100 scale-110 shadow-red-950/20' : 'opacity-40 group-hover:opacity-100 group-hover:scale-105'} transition-all duration-500 border border-white/[0.03]`}>
                                                                <item.icon className="w-5 h-5 italic" />
                                                            </div>
                                                            <span className="text-[13px] uppercase tracking-tighter italic leading-none">{item.name}</span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Logout Button */}
                            <div className="mt-16 pt-10 border-t border-white/[0.03]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-5 px-5 py-5 rounded-[22px] text-slate-800 hover:bg-red-500/5 hover:text-[#b91c1c] transition-all font-black group italic uppercase tracking-tighter shadow-inner"
                                >
                                    <div className="w-10 h-10 rounded-[18px] flex items-center justify-center text-white shadow-2xl bg-[#050505] group-hover:bg-[#b91c1c] shrink-0 transition-all border border-white/5">
                                        <LogOut className="w-5 h-5" />
                                    </div>
                                    <span className="text-[13px] leading-none">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar} 
                        className="fixed inset-0 bg-[#050505]/90 backdrop-blur-2xl z-[55] md:hidden" 
                    />
                )}
            </AnimatePresence>
        </>
    );
}
