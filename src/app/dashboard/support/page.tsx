"use client";

import { useState, useEffect } from "react";
import {
    Headset, Send, MessageCircle, Clock,
    CheckCircle2, AlertCircle, Plus, ChevronRight,
    ChevronDown, User as UserIcon, ShieldCheck,
    X, ArrowUpRight, Zap, Shield, Target, Activity
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNew, setShowNew] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Form states
    const [subject, setSubject] = useState("");
    const [requestType, setRequestType] = useState("General");
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState("");
    const [reply, setReply] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/tickets");
            const data = await res.json();
            setTickets(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, request: requestType, message, order_id: orderId })
            });
            if (res.ok) {
                setShowNew(false);
                setSubject("");
                setMessage("");
                fetchTickets();
            }
        } catch (e) { alert("Failed to create ticket"); }
        setSubmitting(false);
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

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-8 md:pb-10 border-b border-white/[0.03] italic"
            >
                <div className="space-y-2 md:space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Help & <span className="text-[#b91c1c]">Support</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)] italic"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Priority response active for all members
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowNew(true)}
                    className="h-14 md:h-16 px-8 md:px-10 bg-[#b91c1c] text-white rounded-[20px] md:rounded-[24px] font-black text-[11px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-3 md:gap-4 shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all active:scale-95 italic"
                >
                    <Plus className="w-5 h-5 italic" />
                    Open Ticket
                </button>
            </motion.div>

            {/* Quick Contact Cards */}
            <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-reveal italic"
            >
                <div className="p-8 md:p-12 bg-[#b91c1c] text-white flex items-center gap-6 md:gap-10 rounded-[32px] md:rounded-[48px] shadow-2xl relative overflow-hidden group shadow-inner">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 italic"></div>
                    <div className="w-16 md:w-20 h-16 md:h-20 bg-white/10 rounded-2xl md:rounded-[28px] flex items-center justify-center backdrop-blur-3xl relative z-10 shadow-2xl border border-white/10 italic">
                        <Clock className="w-8 md:w-10 h-8 md:h-10 italic" />
                    </div>
                    <div className="relative z-10 space-y-1 md:space-y-2 italic leading-none">
                        <h3 className="font-black uppercase tracking-tighter text-xl md:text-2xl italic leading-none">Response Time</h3>
                        <p className="text-[9px] md:text-[10px] font-black text-white/70 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">AVG 15 MINS • ONLINE 24/7</p>
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-8 md:space-y-10 italic">
                <div className="flex items-center justify-between px-4 md:px-8 italic">
                    <h2 className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] flex items-center gap-4 italic leading-none">
                        <MessageCircle className="w-4 h-4 text-[#b91c1c] italic" />
                        Ticket History
                    </h2>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] md:tracking-[0.3em] italic leading-none">{tickets.length} TOTAL THREADS</span>
                </div>

                <AnimatePresence mode="wait">
                {loading ? (
                    <div 
                        className="py-32 md:py-48 flex flex-col items-center justify-center gap-8 md:gap-10 bg-[#0a0a0c] rounded-[40px] md:rounded-[56px] border border-white/[0.03] shadow-inner italic"
                    >
                        <div className="w-10 md:w-12 h-10 md:h-12 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin italic"></div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.6em] animate-pulse leading-none italic">Syncing Tickets...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div 
                        className="py-32 md:py-48 text-center space-y-8 md:space-y-10 bg-[#0a0a0c] rounded-[40px] md:rounded-[56px] border border-white/[0.03] shadow-inner flex flex-col items-center justify-center animate-reveal italic"
                    >
                        <div className="w-20 md:w-28 h-20 md:h-28 bg-[#050505] rounded-[32px] md:rounded-[40px] flex items-center justify-center border border-white/[0.03] shadow-2xl italic">
                            <Headset className="w-10 md:w-12 h-10 md:h-12 text-slate-950 italic" />
                        </div>
                        <div className="space-y-3 md:space-y-4 italic">
                            <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">No Tickets Found</p>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic opacity-60">Open a ticket if you need any assistance</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 md:space-y-8 animate-reveal italic">
                        {tickets.map((t, i) => (
                            <div 
                                key={t._id} 
                                className="bg-[#0a0a0c] border border-white/5 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden group transition-all shadow-inner italic"
                            >
                                <div
                                    onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
                                    className="p-8 md:p-12 flex items-center justify-between cursor-pointer hover:bg-white/[0.01] transition-colors italic"
                                >
                                    <div className="flex items-center gap-6 md:gap-10 italic">
                                        <div className={`w-14 md:w-20 h-14 md:h-20 rounded-2xl md:rounded-[28px] flex items-center justify-center border transition-all italic ${t.status === 'Answered' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' :
                                            t.status === 'Closed' ? 'bg-[#050505] text-slate-900 border-white/5' :
                                                'bg-[#b91c1c]/5 text-[#b91c1c] border-[#b91c1c]/10'
                                            }`}>
                                            {t.status === 'Answered' ? <CheckCircle2 className="w-7 md:w-10 h-7 md:h-10 italic" /> : <Activity className="w-7 md:w-10 h-7 md:h-10 italic" />}
                                        </div>
                                        <div className="space-y-2 md:space-y-3 italic">
                                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-[#b91c1c] transition-all leading-none italic">{t.subject}</h3>
                                            <div className="flex flex-wrap items-center gap-3 md:gap-4 italic">
                                                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-900 tracking-[0.3em] md:tracking-[0.4em] leading-none italic">ID: {t._id.slice(-6).toUpperCase()}</span>
                                                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-3 md:px-4 py-1.5 md:py-2 rounded-xl border italic leading-none ${t.status === 'Answered' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                    t.status === 'Closed' ? 'border-white/5 text-slate-900 bg-white/[0.01]' :
                                                        'border-[#b91c1c]/20 text-[#b91c1c] bg-[#b91c1c]/5'
                                                    }`}>{t.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 md:gap-10 italic">
                                        <div className="text-right hidden sm:block space-y-1 italic">
                                            <p className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.4em] leading-none mb-1 italic">UPDATED</p>
                                            <p className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-tighter italic leading-none italic">{new Date(t.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <div className="w-12 md:w-16 h-12 md:h-16 bg-[#050505] rounded-xl md:rounded-[22px] flex items-center justify-center text-slate-900 group-hover:bg-[#b91c1c] group-hover:text-white transition-all italic">
                                            {expandedId === t._id ? <ChevronDown className="w-6 md:w-8 h-6 md:h-8 italic" /> : <ChevronRight className="w-6 md:w-8 h-6 md:h-8 italic" />}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                {expandedId === t._id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/[0.02] bg-[#050505]/40 shadow-inner italic"
                                    >
                                        <div className="p-8 md:p-12 space-y-8 md:space-y-12 max-h-[500px] md:max-h-[600px] overflow-y-auto custom-scrollbar-red italic">
                                            {t.messages.map((m: any, mIdx: number) => (
                                                <div key={mIdx} className={`flex italic ${m.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[90%] md:max-w-[85%] rounded-[28px] md:rounded-[40px] p-6 md:p-10 shadow-2xl relative italic shadow-inner ${m.sender === 'User'
                                                        ? 'bg-[#b91c1c] text-white rounded-tr-none'
                                                        : 'bg-[#0a0a0c] border border-white/5 text-slate-400 rounded-tl-none'
                                                        }`}>
                                                        <div className={`flex items-center gap-3 md:gap-4 mb-4 md:mb-6 italic ${m.sender === 'User' ? 'text-white/60' : 'text-slate-900'}`}>
                                                            {m.sender === 'Admin' ? <Shield className="w-4 h-4 italic" /> : <UserIcon className="w-4 h-4 italic" />}
                                                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">{m.sender}</span>
                                                        </div>
                                                        <p className="text-[13px] md:text-[15px] font-black leading-relaxed uppercase tracking-tight italic">{m.message}</p>
                                                        <div className={`mt-6 md:mt-8 text-right italic ${m.sender === 'User' ? 'text-black/20' : 'text-slate-950'}`}>
                                                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] italic leading-none italic">
                                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {t.status !== 'Closed' && (
                                            <div className="p-8 md:p-12 pt-0 italic">
                                                <div className="flex gap-4 bg-[#050505] p-3 md:p-6 rounded-[24px] md:rounded-[32px] border border-white/5 focus-within:border-[#b91c1c]/30 transition-all shadow-inner italic">
                                                    <input
                                                        type="text"
                                                        placeholder="Type your reply..."
                                                        value={reply}
                                                        onChange={(e) => setReply(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleReply(t._id)}
                                                        className="flex-1 h-12 md:h-14 bg-transparent px-4 md:px-6 text-[12px] md:text-[13px] font-black text-white outline-none uppercase placeholder-slate-950 italic tracking-wider italic"
                                                    />
                                                    <button
                                                        onClick={() => handleReply(t._id)}
                                                        className="w-12 md:w-16 h-12 md:h-16 bg-[#b91c1c] text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all active:scale-95 italic"
                                                    >
                                                        <Send className="w-5 md:w-6 h-5 md:h-6 italic" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
                </AnimatePresence>
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
            {showNew && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto italic">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0a0a0c] w-full max-w-3xl rounded-[40px] md:rounded-[64px] shadow-2xl border border-white/[0.03] overflow-hidden relative shadow-inner italic"
                    >
                        <div className="p-8 md:p-16 border-b border-white/[0.03] flex items-center justify-between italic">
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">New <span className="text-[#b91c1c]">Support Ticket</span></h2>
                            <button onClick={() => setShowNew(false)} className="w-12 md:w-14 h-12 md:h-14 bg-[#050505] text-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#b91c1c] hover:text-white transition-all italic">
                                <X className="w-6 md:w-7 h-6 md:h-7 italic" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-8 md:p-16 space-y-8 md:space-y-12 italic">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 italic">
                                <div className="space-y-3 md:space-y-4 italic">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Choose Category</label>
                                    <select
                                        value={requestType}
                                        onChange={(e) => setRequestType(e.target.value)}
                                        className="w-full h-14 md:h-18 bg-[#050505] border border-white/5 rounded-xl md:rounded-2xl px-6 md:px-8 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 uppercase tracking-[0.2em] transition-all appearance-none cursor-pointer italic shadow-inner"
                                    >
                                        <option>General</option>
                                        <option>Order</option>
                                        <option>Payment</option>
                                        <option>Refill</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-3 md:space-y-4 italic">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Order ID (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="#0000"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="w-full h-14 md:h-18 bg-[#050505] border border-white/5 rounded-xl md:rounded-2xl px-6 md:px-8 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 uppercase transition-all placeholder:text-slate-950 italic tracking-wider shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3 md:space-y-4 italic">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Brief summary of your issue..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full h-14 md:h-18 bg-[#050505] border border-white/5 rounded-xl md:rounded-2xl px-6 md:px-8 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 uppercase transition-all placeholder:text-slate-950 italic tracking-wider shadow-inner"
                                />
                            </div>
                            <div className="space-y-3 md:space-y-4 italic">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Message Details</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Explain your problem in detail..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-[#050505] border border-white/5 rounded-[28px] md:rounded-[40px] p-6 md:p-10 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 resize-none uppercase transition-all placeholder:text-slate-950 italic tracking-wide leading-relaxed shadow-inner"
                                />
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full h-20 md:h-24 bg-[#b91c1c] text-white rounded-[26px] md:rounded-[32px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-2xl shadow-red-950/40 text-[13px] md:text-[14px] hover:bg-[#991b1b] transition-all disabled:opacity-50 italic active:scale-95 italic"
                            >
                                {submitting ? "SUBMITTING..." : "CREATE TICKET"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </div>
    );
}
