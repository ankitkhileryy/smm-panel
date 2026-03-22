"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    List,
    ClipboardList,
    Users,
    Search,
    ArrowRight,
    Wallet,
    Instagram,
    Facebook,
    Youtube,
    Send,
    Twitter,
    History,
    Sparkles,
    Zap,
    User,
    ChevronDown,
    Activity,
    Shield,
    Target
} from "lucide-react";

function cleanCategoryName(name: string) {
    if (!name) return "";
    return name.normalize("NFKD")
        .replace(/[\u{1D400}-\u{1D7FF}]/gu, (char) => {
            const cp = char.codePointAt(0);
            if (!cp) return char;
            if (cp >= 0x1D400 && cp <= 0x1D419) return String.fromCodePoint(cp - 0x1D400 + 65);
            if (cp >= 0x1D41A && cp <= 0x1D433) return String.fromCodePoint(cp - 0x1D41A + 97);
            if (cp >= 0x1D452 && cp <= 0x1D452) return 'e'; 
            return char;
        })
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

export default function NewOrderPage() {
    const { user, refreshUser } = useAuth();
    const [allServices, setAllServices] = useState<any[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [selectedService, setSelectedService] = useState<any>(null);
    const [link, setLink] = useState("");
    const [quantity, setQuantity] = useState(100);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

    const platforms = [
        { name: "Instagram", search: ["IG", "Instagram", "Insta"], icon: Instagram },
        { name: "Facebook", search: ["FB", "Facebook", "Meta"], icon: Facebook },
        { name: "YouTube", search: ["YT", "YouTube", "Video"], icon: Youtube },
        { name: "Telegram", search: ["TG", "Telegram", "Tele"], icon: Send },
        { name: "Twitter/X", search: ["Twitter", "X ", "X-Global", "X"], icon: Twitter },
        { name: "TikTok", search: ["TT", "TikTok", "Shorts"], icon: ({ className }: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg> },
        { name: "All", search: [""], icon: List }
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services");
                if (res.ok) {
                    const data = await res.json();
                    setAllServices(data);
                    const cats = [...new Set(data.map((s: any) => s.category))] as string[];
                    setAllCategories(cats);
                    setCategories(cats);
                    if (cats.length > 0) setSelectedCategory(cats[0]);
                }
            } catch (err) {
                console.error("Failed to load services");
            } finally {
                setFetching(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        let filteredCats = allCategories;
        if (selectedPlatform && selectedPlatform !== "All") {
            const p = platforms.find(pl => pl.name === selectedPlatform);
            const searchTerms = p?.search.map(s => cleanCategoryName(s)) || [];
            filteredCats = allCategories.filter(cat => {
                const cleanCat = cleanCategoryName(cat);
                return searchTerms.some(t => cleanCat.includes(t));
            });
        }
        setCategories(filteredCats);

        if (filteredCats.length > 0 && !filteredCats.includes(selectedCategory)) {
            setSelectedCategory(filteredCats[0]);
        }
    }, [selectedPlatform, allCategories]);

    useEffect(() => {
        const filtered = allServices.filter(s => s.category === selectedCategory);
        setFilteredServices(filtered);
        if (filtered.length > 0) {
            setSelectedServiceId(filtered[0].service);
            setSelectedService(filtered[0]);
        }
    }, [selectedCategory, allServices]);

    useEffect(() => {
        const service = allServices.find(s => s.service === selectedServiceId);
        setSelectedService(service);
    }, [selectedServiceId, allServices]);

    const charge = selectedService ? (quantity / 1000) * parseFloat(selectedService.rate) : 0;
    const balance = user?.balance || 0;
    const totalOrders = (user as any)?.totalOrders || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedServiceId) return alert("Please select a service first");
        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service_id: selectedServiceId, link, quantity, charge }),
            });
            if (res.ok) {
                await refreshUser();
                alert("Order placed successfully!");
                setLink("");
            } else {
                const data = await res.json();
                alert(data.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative overflow-hidden bg-[#050505]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#b91c1c]/5 blur-[100px] rounded-full"></div>
                <div className="flex flex-col items-center gap-6 relative z-10 text-center">
                    <motion.div 
                        animate={{ rotate: 360, opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border border-[#b91c1c]/40 border-t-[#b91c1c] rounded-full"
                    />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 leading-none italic">Syncing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 md:space-y-10 pb-16 font-sans text-slate-800 px-4 md:px-0">
            {/* Top Welcome Banner */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#0a0a0c] to-[#050505] rounded-[32px] md:rounded-[40px] p-6 md:p-10 relative overflow-hidden flex flex-col gap-8 md:gap-10 border border-white/[0.03] shadow-2xl shadow-inner italic"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 z-10 relative">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-16 md:w-20 h-16 md:h-20 rounded-[20px] md:rounded-[28px] bg-[#050505] border border-white/5 flex items-center justify-center text-[#b91c1c] shadow-2xl">
                            <Shield className="w-8 md:w-10 h-8 md:h-10 italic" />
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] mb-1 leading-none italic">Welcome Back</p>
                            <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">{user?.email?.split('@')[0] || "USER"}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href="/dashboard/add-funds" className="h-14 md:h-16 px-8 md:px-10 rounded-2xl md:rounded-[22px] bg-[#b91c1c] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all hover:bg-[#991b1b] flex-1 md:flex-none flex items-center justify-center gap-3 italic">
                            <Zap className="w-4 h-4" /> Add Funds
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 z-10 relative">
                    <div className="bg-[#050505] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex justify-between items-center transition-all hover:border-[#b91c1c]/20 shadow-inner">
                        <div className="space-y-2 md:space-y-3">
                            <p className="text-slate-900 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] leading-none italic">Your Balance</p>
                            <p className="font-black text-white text-2xl md:text-3xl tracking-tighter italic leading-none">₹{balance.toFixed(2)}</p>
                        </div>
                        <div className="w-12 md:w-14 h-12 md:h-14 bg-[#b91c1c]/5 rounded-xl md:rounded-2xl flex items-center justify-center text-[#b91c1c] border border-[#b91c1c]/10">
                            <Wallet className="w-6 md:w-7 h-6 md:w-7 italic" />
                        </div>
                    </div>
                    <div className="bg-[#050505] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex justify-between items-center transition-all hover:border-[#b91c1c]/20 shadow-inner">
                        <div className="space-y-2 md:space-y-3">
                            <p className="text-slate-900 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] leading-none italic">Total Orders</p>
                            <p className="font-black text-white text-2xl md:text-3xl tracking-tighter italic leading-none">{totalOrders}</p>
                        </div>
                        <div className="w-12 md:w-14 h-12 md:h-14 bg-[#b91c1c]/5 rounded-xl md:rounded-2xl flex items-center justify-center text-[#b91c1c] border border-[#b91c1c]/10">
                            <Activity className="w-6 md:w-7 h-6 md:w-7 italic" />
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 md:gap-12 items-start">
                <div className="space-y-8 md:space-y-10">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-[#0a0a0c] border border-white/[0.03] rounded-[24px] md:rounded-3xl shadow-inner italic">
                        <button className="flex-1 flex justify-center items-center gap-3 bg-[#b91c1c] text-white py-4 rounded-[20px] md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all">
                            <Sparkles className="w-4 h-4" /> Place New Order
                        </button>
                    </div>

                    {/* Platform Pills */}
                    <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-4 custom-scrollbar-red snap-x italic">
                        {platforms.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => setSelectedPlatform(p.name)}
                                className={`flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[20px] whitespace-nowrap text-[9px] md:text-[10px] font-black transition-all border snap-center uppercase tracking-[0.2em] md:tracking-[0.3em] ${selectedPlatform === p.name
                                        ? "bg-white text-black border-white shadow-2xl"
                                        : "bg-[#0a0a0c] border-white/5 text-slate-800 hover:text-white hover:border-[#b91c1c]/30 shadow-inner"
                                    }`}
                            >
                                <p.icon className={`w-4 h-4 italic ${selectedPlatform === p.name ? 'text-black' : 'text-slate-800'}`} />
                                {p.name}
                            </button>
                        ))}
                    </div>

                    {/* Form Controls */}
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 animate-reveal italic">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 leading-none italic">Choose Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedPlatform(null);
                                    }}
                                    className="w-full h-14 md:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/40 transition-all appearance-none cursor-pointer shadow-inner uppercase tracking-wider italic"
                                >
                                    {categories.map(cat => <option key={cat} value={cat} className="bg-[#0a0a0c] text-white">{cat}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 leading-none italic">Choose Service</label>
                                <select
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="w-full h-14 md:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/40 transition-all appearance-none cursor-pointer shadow-inner uppercase tracking-wider italic"
                                >
                                    {filteredServices.map(s => <option key={s.service} value={s.service} className="bg-[#0a0a0c] text-white">{s.service} - {s.name} - ₹{parseFloat(s.rate).toFixed(2)}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 leading-none italic">Service Description</label>
                            <div className="w-full min-h-[140px] md:min-h-[160px] bg-[#0a0a0c] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-10 text-[11px] md:text-[12px] text-slate-800 font-bold whitespace-pre-wrap leading-relaxed shadow-inner italic">
                                <div className="flex flex-wrap gap-6 md:gap-10 mb-6 md:mb-8 border-b border-white/[0.03] pb-6">
                                    <div className="flex items-center gap-2.5 md:gap-3"><div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div> <span className="text-slate-900 font-black text-[8px] md:text-[9px] uppercase tracking-widest leading-none italic">Start Time</span> <span className="text-white leading-none tracking-tight italic">Instant Execution</span></div>
                                    <div className="flex items-center gap-2.5 md:gap-3"><div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#b91c1c] shadow-[0_0_8px_rgba(185,28,28,0.3)]"></div> <span className="text-slate-900 font-black text-[8px] md:text-[9px] uppercase tracking-widest leading-none italic">Speed</span> <span className="text-white leading-none tracking-tight italic">High Speed / Quality</span></div>
                                </div>
                                <div className="text-slate-800 uppercase tracking-widest leading-loose italic opacity-80">
                                    {selectedService?.desc || 'Instructions for this service:\n\n1. Profile or Link must be Public.\n2. Do not place multiple orders for the same link at once.\n3. Make sure to double check your link before ordering.'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 leading-none italic">Paste Link Here</label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    required
                                    placeholder="https://example.com/profile"
                                    className="w-full h-14 md:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/40 transition-all shadow-inner tracking-wider italic"
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 leading-none italic">Enter Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    placeholder="Minimum 100"
                                    className="w-full h-14 md:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/40 transition-all shadow-inner tracking-wider italic"
                                />
                            </div>
                        </div>

                         <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] md:rounded-[40px] p-8 md:p-10 flex flex-col sm:flex-row justify-between items-center gap-8 md:gap-10 shadow-2xl mt-8 italic">
                            <div className="text-center sm:text-left space-y-2">
                                <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none mb-2 italic">Total Charge</span>
                                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter italic leading-none">₹{charge.toFixed(2)}</div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 bg-[#b91c1c] text-white rounded-[22px] md:rounded-[26px] font-black text-[11px] md:text-[13px] uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all disabled:opacity-50 shadow-2xl shadow-red-950/40 flex items-center justify-center gap-4 hover:bg-[#991b1b] active:scale-95 italic"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Submit Order <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-8 md:space-y-10 lg:sticky lg:top-[110px] italic">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">Activity Feed</h3>
                        <Link href="/dashboard/history" className="text-[9px] font-black text-[#b91c1c] hover:underline uppercase tracking-[0.3em] italic leading-none">View All</Link>
                    </div>
                    
                    <div 
                        className="bg-[#0a0a0c] border border-white/5 rounded-[40px] md:rounded-[48px] p-10 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px] md:min-h-[450px] shadow-inner relative overflow-hidden italic"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#b91c1c]/5 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none"></div>
                        <div className="w-20 md:w-24 h-20 md:h-24 bg-[#050505] border border-white/[0.03] rounded-[32px] flex items-center justify-center mb-10 text-[#b91c1c] shadow-2xl relative z-10">
                            <ClipboardList className="w-10 md:w-12 h-10 md:h-12 italic" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">No Recent Activity</h4>
                        <p className="text-[10px] text-slate-900 max-w-[280px] leading-relaxed mb-10 md:mb-12 font-black uppercase tracking-widest opacity-60 italic">
                            Your most recent orders will appear here automatically.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="h-12 md:h-14 px-8 md:px-10 bg-[#050505] border border-white/[0.05] text-slate-800 hover:text-white rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-[#b91c1c] hover:border-[#b91c1c] active:scale-95 italic shadow-inner"
                        >
                            Refresh Hub
                        </button>
                    </div>

                    {/* Pro Tip Card */}
                    <div className="bg-gradient-to-br from-[#0a0a0c] to-[#050505] border border-white/[0.05] rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-2xl relative overflow-hidden italic shadow-inner">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#b91c1c]"></div>
                        <div className="flex items-center gap-4 mb-5 md:mb-6">
                            <div className="p-2.5 bg-[#b91c1c]/10 rounded-xl border border-[#b91c1c]/10">
                                <Zap className="w-4 h-4 text-[#b91c1c] italic" />
                            </div>
                            <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Useful Tip</span>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-slate-800 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                            Add funds via <b className="text-[#b91c1c]">UPI</b> for instant activation and better success rates on all services.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
