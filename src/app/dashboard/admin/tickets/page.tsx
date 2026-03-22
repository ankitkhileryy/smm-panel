"use client";

import { useState, useEffect } from "react";
import {
    Headset, Send, MessageCircle, Clock,
    CheckCircle2, AlertCircle, ChevronRight,
    ChevronDown, User as UserIcon, ShieldCheck,
    Mail, ExternalLink, Search, LayoutGrid, Filter, Target, Activity, Shield
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTicketsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [reply, setReply] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.push("/dashboard");
        } else {
            fetchTickets();
        }
    }, [user, authLoading]);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/admin/tickets");
            const data = await res.json();
            setTickets(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleReply = async (ticketId: string) => {
        if (!reply.trim()) return;
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: reply })
            });
            if (res.ok) {
                setReply("");
                fetchTickets();
            }
        } catch (e) { alert("Failed to send reply"); }
    };

    const filteredTickets = tickets.filter(t => filter === "All" || t.status === filter);

    if (loading || authLoading) return (
        <div className="flex flex-col items-center justify-center py-48 gap-8 bg-[#050505] italic">
            <motion.div 
                animate={{ rotate: 360, opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 md:w-16 h-12 md:h-16 border-2 border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full italic"
            />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.6em] md:tracking-[0.8em] animate-pulse italic leading-none">Syncing Support Desk...</p>
        </div>
    );

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 pb-8 md:pb-10 border-b border-white/[0.03] italic"
            >
                <div className="space-y-2 md:space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Ticket <span className="text-[#b91c1c]">Management</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4 italic opacity-80 leading-none">
                        <ShieldCheck className="w-4 h-4 text-[#b91c1c] italic" />
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Administrative Support Control Dashboard
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6 italic">
                    <div className="px-5 md:px-6 py-2 md:py-2.5 bg-[#b91c1c]/5 rounded-full border border-[#b91c1c]/10 flex items-center gap-3 md:gap-4 italic shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse italic"></div>
                        <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Live Monitoring</span>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 animate-reveal italic">
                <div className="flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 bg-[#0a0a0c] rounded-xl md:rounded-2xl border border-white/5 mr-2 md:mr-4 shadow-inner italic">
                    <Filter className="w-3.5 md:w-4 h-3.5 md:h-4 text-slate-800 italic" />
                    <span className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Filters</span>
                </div>
                {["All", "Open", "Pending", "Answered", "Closed"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`h-10 md:h-12 px-5 md:px-8 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border transition-all active:scale-95 italic ${filter === f
                                ? "bg-[#b91c1c] border-[#b91c1c] text-white shadow-2xl shadow-red-950/40"
                                : "bg-[#0a0a0c] text-slate-800 border-white/5 hover:border-[#b91c1c]/20 hover:text-white shadow-inner"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Tickets Grid */}
            <div className="space-y-6 md:space-y-8 animate-reveal italic">
                {filteredTickets.length === 0 ? (
                    <div className="py-32 md:py-48 text-center space-y-8 md:space-y-10 bg-[#0a0a0c] rounded-[32px] md:rounded-[56px] border border-white/[0.03] shadow-2xl shadow-inner italic">
                        <div className="w-20 md:w-28 h-20 md:h-28 bg-[#050505] rounded-[28px] md:rounded-[40px] flex items-center justify-center mx-auto border border-white/5 shadow-2xl italic">
                            <AlertCircle className="w-10 md:w-12 h-10 md:h-12 text-slate-950 italic" />
                        </div>
                        <div className="space-y-3 md:space-y-4 italic">
                            <p className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">No active tickets</p>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none opacity-60">All support protocols are currently clear</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 md:space-y-6 italic">
                        {filteredTickets.map((t) => (
                            <div key={t._id} className="bg-[#0a0a0c] border border-white/[0.03] rounded-[28px] md:rounded-[48px] shadow-2xl overflow-hidden group hover:bg-white/[0.01] transition-all shadow-inner italic">
                                <div
                                    onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
                                    className="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-colors gap-6 md:gap-8 italic"
                                >
                                    <div className="flex items-center gap-6 md:gap-10 italic">
                                        <div className={`w-14 md:w-20 h-14 md:h-20 rounded-[22px] md:rounded-[30px] flex items-center justify-center border-2 md:border-4 font-black text-xl md:text-2xl transition-all italic ${t.status === 'Answered' ? 'bg-[#050505] text-emerald-500 border-emerald-500/10 shadow-inner' :
                                                t.status === 'Closed' ? 'bg-[#050505] text-slate-900 border-white/5 shadow-inner' :
                                                    'bg-[#050505] text-[#b91c1c] border-[#b91c1c]/20 shadow-inner'
                                            }`}>
                                            {t.request?.[0] || 'T'}
                                        </div>
                                        <div className="space-y-2 md:space-y-3 italic">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-6 italic">
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic leading-none italic">{t.subject}</h3>
                                                <span className={`w-fit text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-3 py-1.5 rounded-xl border italic leading-none ${t.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10 shadow-inner' :
                                                        'bg-[#b91c1c]/10 text-[#b91c1c] border-[#b91c1c]/10 shadow-inner'
                                                    }`}>{t.status}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 md:gap-8 italic">
                                                <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none italic">
                                                    <Mail className="w-3.5 md:w-4 h-3.5 md:h-4 italic" />
                                                    {t.user_id?.email || 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none italic">
                                                    <Clock className="w-3.5 md:w-4 h-3.5 md:h-4 italic" />
                                                    {new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                {t.order_id && (
                                                    <div className="px-2.5 md:px-3 py-1 md:py-1.5 bg-[#050505] text-slate-900 rounded-xl text-[8px] md:text-[9px] font-black uppercase border border-white/5 tracking-[0.1em] md:tracking-[0.2em] italic leading-none">
                                                        #{t.order_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 md:gap-6 self-end md:self-auto italic">
                                        <div className={`w-10 md:w-14 h-10 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all italic ${expandedId === t._id ? 'bg-[#b91c1c] text-white shadow-2xl shadow-red-950/40' : 'bg-[#050505] text-slate-900 border border-white/5'}`}>
                                            {expandedId === t._id ? <ChevronDown className="w-6 md:w-7 h-6 md:h-7 italic" /> : <ChevronRight className="w-6 md:w-7 h-6 md:h-7 italic" />}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                {expandedId === t._id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/[0.03] p-6 md:p-10 bg-[#050505]/20 italic shadow-inner"
                                    >
                                        <div className="space-y-6 md:space-y-8 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-4 md:pr-6 mb-8 md:mb-12 custom-scrollbar-red italic">
                                            {t.messages.map((m: any, mIdx: number) => (
                                                <div key={mIdx} className={`flex italic ${m.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[90%] md:max-w-[85%] rounded-[24px] md:rounded-[40px] p-6 md:p-8 shadow-2xl border italic shadow-inner ${m.sender === 'Admin'
                                                        ? 'bg-[#b91c1c] text-white border-white/10 rounded-tr-none shadow-red-950/20'
                                                        : 'bg-[#0a0a0c] border-white/5 text-slate-400 rounded-tl-none'
                                                        }`}>
                                                        <div className={`flex items-center gap-2 md:gap-3 mb-4 italic ${m.sender === 'Admin' ? 'text-white/80' : 'text-slate-900'}`}>
                                                            {m.sender === 'Admin' ? <ShieldCheck className="w-4 h-4 italic" /> : <UserIcon className="w-4 h-4 italic" />}
                                                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">{m.sender}</span>
                                                        </div>
                                                        <p className="text-[13px] md:text-[14px] font-black leading-relaxed uppercase tracking-normal italic leading-relaxed">{m.message}</p>
                                                        <div className={`mt-4 md:mt-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic ${m.sender === 'Admin' ? 'text-white/40' : 'text-slate-950'} text-right italic`}>
                                                            {new Date(m.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-[#0a0a0c] p-3 md:p-4 rounded-[28px] md:rounded-[40px] border border-white/[0.03] shadow-2xl shadow-inner italic">
                                            <input
                                                type="text"
                                                placeholder="Type your response..."
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleReply(t._id)}
                                                className="flex-1 h-12 md:h-18 bg-transparent px-6 md:px-8 text-[12px] md:text-[13px] font-black text-white outline-none uppercase placeholder-slate-950 tracking-wider italic"
                                            />
                                            <button
                                                onClick={() => handleReply(t._id)}
                                                className="h-12 md:h-18 px-8 md:px-12 bg-[#b91c1c] text-white rounded-[20px] md:rounded-[30px] font-black text-[11px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#991b1b] transition-all shadow-2xl shadow-red-950/40 active:scale-95 italic"
                                            >
                                                Send Reply
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
