"use client";

import { useState, useEffect } from "react";
import { CreditCard, History, RefreshCcw, CheckCircle2, XCircle, Clock, Wallet, ShieldCheck, Search, Activity, Zap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FundingHistoryPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/payments/history");
            const data = await res.json();
            if (res.ok) setPayments(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-16 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-8 md:pb-10 border-b border-white/[0.03] italic"
            >
                <div className="space-y-2 md:space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Funding <span className="text-[#b91c1c]">History</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse italic"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Transaction Ledger • Encrypted Nodes
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Content Area */}
            <div className="animate-reveal italic">
                {loading ? (
                    <div className="py-48 flex flex-col items-center justify-center gap-8 bg-[#0a0a0c] rounded-[48px] border border-white/[0.03] italic">
                        <div className="w-10 h-10 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin italic"></div>
                        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-900 italic">Syncing Ledger...</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="py-48 flex flex-col items-center justify-center text-center gap-8 bg-[#0a0a0c] rounded-[48px] border border-white/[0.03] italic shadow-inner">
                        <div className="w-20 h-20 bg-[#050505] rounded-[32px] flex items-center justify-center text-slate-950 border border-white/5 shadow-2xl">
                            <CreditCard className="w-10 h-10 italic" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">No Transactions Yet</h3>
                        <p className="text-[10px] text-slate-900 uppercase tracking-[0.4em] max-w-sm italic leading-relaxed">Your wallet activity will appear here once you add funds via PhonePe.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:gap-8 italic">
                        {payments.map((p, idx) => (
                            <div 
                                key={idx}
                                className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[40px] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 group transition-all hover:bg-white/[0.01] shadow-2xl relative overflow-hidden italic shadow-inner"
                            >
                                <div className="flex items-center gap-6 md:gap-10 italic">
                                    <div className={`w-14 md:w-16 h-14 md:h-16 rounded-[22px] flex items-center justify-center border shadow-2xl italic transition-all ${
                                        p.status === 'Completed' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white' :
                                        p.status === 'Failed' ? 'bg-red-500/5 text-red-500 border-red-500/10 group-hover:bg-red-500 group-hover:text-white' :
                                        'bg-slate-900/5 text-slate-900 border-white/5'
                                    }`}>
                                        {p.status === 'Completed' ? <CheckCircle2 className="w-7 h-7 italic" /> : 
                                         p.status === 'Failed' ? <XCircle className="w-7 h-7 italic" /> : 
                                         <Clock className="w-7 h-7 italic" />}
                                    </div>
                                    <div className="space-y-2 md:space-y-3 italic">
                                        <div className="flex items-baseline gap-4 italic">
                                            <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter leading-none">₹{p.amount.toFixed(2)}</h3>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border italic leading-none ${
                                                p.status === 'Completed' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                p.status === 'Failed' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                                                'border-white/5 text-slate-800 bg-white/[0.01]'
                                            }`}>{p.status}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.3em] truncate max-w-[200px] md:max-w-none italic leading-none">TXID: {p.transaction_id.toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-10 md:gap-12 border-t md:border-t-0 border-white/[0.03] pt-6 md:pt-0 italic">
                                    <div className="space-y-2 italic text-left md:text-right">
                                        <p className="text-[9px] font-black text-slate-950 uppercase tracking-[0.3em] leading-none italic">Gateway</p>
                                        <p className="text-[12px] font-black text-white uppercase italic leading-none italic">PhonePe Merchant</p>
                                    </div>
                                    <div className="space-y-2 italic text-left md:text-right">
                                        <p className="text-[9px] font-black text-slate-950 uppercase tracking-[0.3em] leading-none italic">Timestamp</p>
                                        <p className="text-[12px] font-black text-[#b91c1c] uppercase italic leading-none italic">{new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
