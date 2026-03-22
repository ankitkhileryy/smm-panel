"use client";

import { Instagram, Youtube, Send, Globe, Facebook, Search, ArrowRight, Loader2, Info, LayoutGrid, Zap, Shield, Target, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";


import { motion as m, AnimatePresence as AP } from "framer-motion";

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services");
                if (res.ok) {
                    const data = await res.json();
                    setServices(data || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const categories = ["All", ...Array.from(new Set(services.map(s => s.category)))];

    const filteredServices = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesCat = filter === "All" || s.category === filter;
        return matchesSearch && matchesCat;
    });

    const getIcon = (cat: string) => {
        const c = cat.toLowerCase();
        if (c.includes("insta")) return Instagram;
        if (c.includes("you")) return Youtube;
        if (c.includes("tele")) return Send;
        if (c.includes("face")) return Facebook;
        return Globe;
    };

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header */}
            <m.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-8 md:pb-10 border-b border-white/[0.03]"
            >
                <div className="space-y-2 md:space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Available <span className="text-[#b91c1c]">Services</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] leading-none italic">
                            Browse our full catalog
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 md:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 group-focus-within/input:text-[#b91c1c] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH SERVICES..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-14 md:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl pl-16 pr-8 text-white text-[12px] md:text-[13px] font-black outline-none focus:border-[#b91c1c]/30 transition-all uppercase placeholder-slate-900 shadow-inner tracking-wider italic"
                        />
                    </div>
                </div>
            </m.div>

            {/* Platform Filter Pills */}
            <div 
                className="flex flex-wrap gap-2 md:gap-4 animate-reveal"
            >
                {categories.map((cat, i) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`h-10 md:h-14 px-4 md:px-8 rounded-xl md:rounded-[22px] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] border transition-all italic ${filter === cat
                                ? "bg-[#b91c1c] border-[#b91c1c] text-white shadow-2xl shadow-red-950/40"
                                : "bg-[#0a0a0c] text-slate-800 border-white/5 hover:border-[#b91c1c]/20 hover:text-white shadow-inner"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 md:py-64 gap-8 md:gap-10">
                    <div className="w-10 md:w-12 h-10 md:h-12 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.6em] md:tracking-[0.8em] animate-pulse leading-none italic">Loading Services...</p>
                </div>
            ) : (
                <>
                    <AP mode="popLayout">
                    {filteredServices.length > 0 ? (
                        <m.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
                        >
                            {filteredServices.map((service, i) => {
                                const Icon = getIcon(service.category);
                                return (
                                    <m.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.005 }}
                                        key={service.service} 
                                        className="bg-[#0a0a0c] border border-white/5 p-8 md:p-12 flex flex-col justify-between h-full rounded-[32px] md:rounded-[48px] shadow-2xl transition-all group relative overflow-hidden shadow-inner hover:border-[#b91c1c]/30"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#b91c1c]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#b91c1c]/10 transition-all duration-1000"></div>

                                        <div className="relative z-10 space-y-8 md:space-y-12">
                                            <div className="flex items-start justify-between">
                                                <div className="w-16 md:w-20 h-16 md:h-20 rounded-[22px] md:rounded-[28px] bg-[#050505] text-[#b91c1c] flex items-center justify-center border border-white/5 shadow-2xl transition-all group-hover:bg-[#b91c1c]/10">
                                                    <Icon className="w-8 md:w-10 h-8 md:h-10 italic" />
                                                </div>
                                                <div className="text-right space-y-1.5 md:space-y-2">
                                                    <p className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none italic">₹{service.rate}</p>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">PER 1K</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 md:space-y-6">
                                                <h3 className="text-[14px] md:text-[16px] font-black text-white leading-tight line-clamp-2 uppercase tracking-tight transition-colors italic">
                                                    {service.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                    <span className="px-4 md:px-5 py-1.5 md:py-2 bg-[#050505] text-emerald-500 rounded-xl md:rounded-[14px] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-emerald-500/10 italic">
                                                        {service.category}
                                                    </span>
                                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">ID_{service.service}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 mt-8 md:mt-12 pt-8 md:pt-10 border-t border-white/[0.03] flex items-center justify-between gap-6 md:gap-10">
                                            <div className="flex items-center gap-6 md:gap-10">
                                                <div className="flex flex-col gap-1 md:gap-2">
                                                    <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">MIN</span>
                                                    <span className="text-[14px] md:text-[16px] font-black text-white tracking-tighter italic">{service.min.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 md:gap-2">
                                                    <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">MAX</span>
                                                    <span className="text-[14px] md:text-[16px] font-black text-white tracking-tighter italic">{service.max.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dashboard?service=${service.service}`}
                                                className="h-14 md:h-18 w-14 md:w-18 bg-[#b91c1c] text-white rounded-[20px] md:rounded-[24px] flex items-center justify-center shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all active:scale-95 group/btn"
                                            >
                                                <ArrowRight className="w-5 md:w-6 h-5 md:h-6 group-hover/btn:translate-x-0.5 transition-all" />
                                            </Link>
                                        </div>
                                    </m.div>
                                );
                            })}
                        </m.div>
                    ) : (
                        <div 
                            className="py-40 md:py-64 text-center space-y-8 md:space-y-10 flex flex-col items-center justify-center"
                        >
                            <div className="w-24 md:w-28 h-24 md:h-28 bg-[#0a0a0c] rounded-[32px] md:rounded-[40px] flex items-center justify-center border border-white/5 shadow-inner">
                                <Activity className="w-10 md:w-12 h-10 md:h-12 text-slate-900 italic" />
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">No services found</h3>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] md:tracking-[0.6em] leading-none italic">Try searching for something else</p>
                            </div>
                        </div>
                    )}
                    </AP>
                </>
            )}
        </div>
    );
}
