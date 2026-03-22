"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, ShoppingCart, TrendingUp, ShieldCheck, MousePointer2, Shield, Activity, Target } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Background sync
            fetch("/api/orders/sync", { method: "POST" }).catch(() => { });

            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) {
            console.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(ord =>
        (ord.provider_order_id?.toString() || "").includes(searchTerm) ||
        (ord._id?.toString() || "").includes(searchTerm) ||
        (ord.link?.toString() || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-16 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-8 md:pb-10 border-b border-white/[0.03]"
            >
                <div className="space-y-2 md:space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Order <span className="text-[#b91c1c]">History</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] leading-none">View your past orders</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 md:w-96 group">
                        <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 group-focus-within:text-[#b91c1c] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH ORDERS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 md:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl pl-14 md:pl-16 pr-6 md:pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all uppercase placeholder:text-slate-900 tracking-wider shadow-inner"
                        />
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="h-14 md:h-16 w-full sm:w-auto px-8 md:px-10 bg-[#0a0a0c] border border-white/5 rounded-2xl flex items-center justify-center gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white hover:border-[#b91c1c]/30 transition-all shadow-2xl active:scale-95"
                    >
                        <RefreshCw className={`w-4 h-4 text-[#b91c1c] ${loading ? 'animate-spin' : ''}`} />
                        REFRESH
                    </button>
                </div>
            </motion.div>

            <div 
                className="bg-[#0a0a0c] rounded-[32px] md:rounded-[48px] border border-white/5 shadow-2xl overflow-hidden relative min-h-[400px] animate-reveal shadow-inner"
            >
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#050505]/60 border-b border-white/[0.03]">
                                <th className="px-10 py-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">ID</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">STATUS</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">LINK</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] text-right">CHARGE</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] text-right">DATE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            <AnimatePresence mode="popLayout">
                            {loading && orders.length === 0 ? (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key="loading"
                                >
                                    <td colSpan={5} className="py-40 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-10 h-10 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] leading-none">Loading History...</p>
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : filteredOrders.map((ord, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.01 }}
                                    key={ord._id} 
                                    className="hover:bg-white/[0.01] transition-colors group"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[13px] font-black text-white uppercase group-hover:text-[#b91c1c] transition-colors tracking-tighter italic">
                                                #{ord.provider_order_id || ord._id.slice(-8).toUpperCase()}
                                            </span>
                                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">ID: {ord.service_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <StatusBadge status={ord.status} />
                                    </td>
                                    <td className="px-10 py-8 max-w-[240px]">
                                        <a href={ord.link} target="_blank" rel="noreferrer" className="text-[12px] font-black text-slate-700 group-hover:text-[#b91c1c] hover:underline transition-all truncate block uppercase tracking-wider italic">
                                            {ord.link.replace("https://", "").replace("http://", "")}
                                        </a>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className="text-[16px] font-black text-white tracking-tighter italic leading-none">₹{ord.charge.toFixed(2)}</span>
                                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">{ord.quantity.toLocaleString()} QTY</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex flex-col items-end gap-1 opacity-60">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter leading-none">{new Date(ord.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter leading-none">{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4 sm:p-6 space-y-6">
                    <AnimatePresence>
                    {loading && orders.length === 0 ? (
                        <div key="loader" className="py-24 text-center">
                            <div className="w-10 h-10 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">SYNCING...</p>
                        </div>
                    ) : filteredOrders.map((ord, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            key={ord._id} 
                            className="bg-[#050505] border border-white/5 rounded-[28px] p-6 space-y-6 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em] leading-none italic">ORDER_ID</p>
                                    <p className="text-[14px] font-black text-white uppercase italic leading-none truncate">#{ord.provider_order_id || ord._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <StatusBadge status={ord.status} />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2 min-w-0">
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em] leading-none italic">TARGET_LINK</p>
                                    <a href={ord.link} target="_blank" rel="noreferrer" className="block text-[12px] font-black text-[#b91c1c] truncate underline-offset-4 hover:underline uppercase tracking-wider italic">
                                        {ord.link}
                                    </a>
                                </div>

                                <div className="flex justify-between items-end pt-6 border-t border-white/[0.03]">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em] leading-none italic">QUANTITY</p>
                                        <p className="text-[13px] font-black text-white uppercase italic leading-none">{ord.quantity.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em] leading-none italic">CHARGE</p>
                                        <p className="text-2xl font-black text-white leading-none tracking-tighter italic">₹{ord.charge.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="pt-4 text-[9px] font-black text-slate-900 uppercase tracking-[0.4em] text-center opacity-40 italic leading-none">
                                    {new Date(ord.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>

                {!loading && filteredOrders.length === 0 && (
                    <div className="py-40 flex flex-col items-center justify-center text-center px-10">
                        <div className="w-24 h-24 bg-[#050505] rounded-[32px] flex items-center justify-center mb-10 border border-white/5 shadow-inner">
                            <Activity className="w-10 h-10 text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter italic leading-none">No Orders Found</h3>
                        <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.4em] max-w-sm leading-relaxed mb-10">
                            {searchTerm ? "Try searching for a different term." : "You haven't placed any orders yet."}
                        </p>
                        {!searchTerm && (
                            <Link href="/dashboard" className="h-16 px-12 bg-[#b91c1c] text-white rounded-[24px] flex items-center gap-4 font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all active:scale-95 italic text-center">
                                <ShoppingCart className="w-4 h-4" />
                                Start Now
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Panel */}
            <div className="p-8 md:p-10 bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#b91c1c]"></div>
                <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-14 md:h-16 h-14 md:w-16 rounded-[20px] md:rounded-[22px] bg-[#b91c1c]/5 flex items-center justify-center border border-[#b91c1c]/10 shadow-inner">
                        <Target className="w-6 md:h-7 h-6 md:w-7 text-[#b91c1c]" />
                    </div>
                    <div className="space-y-1.5 text-center md:text-left">
                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em] leading-none">SYSTEM STATUS</p>
                        <p className="text-[13px] font-black text-[#b91c1c] uppercase tracking-[0.2em] leading-none italic">LIVE REFRESH ACTIVE</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-800 px-8 py-3 bg-[#050505] rounded-2xl border border-white/[0.05] shadow-inner font-black text-[9px] uppercase tracking-[0.3em] italic">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    SECURITY_VALIDATED
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const statusColors: any = {
        'Completed': 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5',
        'Processing': 'text-[#b91c1c] border-[#b91c1c]/10 bg-[#b91c1c]/5',
        'In progress': 'text-amber-600 border-amber-600/10 bg-amber-600/5',
        'Canceled': 'text-rose-700 border-rose-700/10 bg-rose-700/5',
        'Refunded': 'text-slate-600 border-slate-600/10 bg-slate-600/5',
        'Pending': 'text-indigo-600 border-indigo-600/10 bg-indigo-600/5'
    };

    const currentColor = statusColors[status] || 'text-slate-800 border-white/5 bg-white/[0.01]';

    return (
        <span 
            className={`px-4 md:px-6 py-1.5 md:py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border shadow-inner italic ${currentColor} whitespace-nowrap`}
        >
            {status}
        </span>
    );
}
