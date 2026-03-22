"use client";

import { useState, useEffect } from "react";
import {
    Users, TrendingUp, Wallet, Copy,
    CheckCircle2, Share2, Info, ArrowRight,
    Trophy, Zap, ShieldCheck, Heart, Link as LinkIcon, Activity, Target, Shield
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AffiliatePage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/affiliate/stats");
            const data = await res.json();
            setStats(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const copyLink = () => {
        if (!stats?.referralCode) return;
        const link = `${window.location.origin}/signup?ref=${stats.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 md:py-64 gap-8 md:gap-10">
            <div className="w-10 md:w-12 h-10 md:h-12 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.6em] animate-pulse leading-none italic">Syncing Affiliate Stats...</p>
        </div>
    );

    const referralLink = stats?.referralCode ? `${window.location.host}/signup?ref=${stats.referralCode}` : "AUTHENTICATE_TO_VIEW_LINK";

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[40px] md:rounded-[56px] bg-[#0a0a0c] border border-white/[0.03] p-8 md:p-20 shadow-2xl group shadow-inner"
            >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b91c1c]/5 blur-[120px] -mr-64 -mt-64 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-8 md:space-y-12">
                    <div className="px-5 md:px-6 py-2 md:py-2.5 bg-[#b91c1c]/5 rounded-full border border-[#b91c1c]/10 flex items-center gap-3 md:gap-4 italic">
                        <Trophy className="w-4 h-4 text-[#b91c1c]" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#b91c1c]">SMM12 PARTNER PROGRAM</span>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                            GET <span className="text-[#b91c1c]">5% PROFIT</span> <br />
                            ON EVERY <span className="text-[#b91c1c]">ORDER</span>
                        </h1>
                        <p className="text-slate-900 max-w-2xl mx-auto text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] leading-relaxed italic">
                            Share your referral link with your network and earn 5% commission on every fund recharge they make. Lifetime recurring profit.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="flex flex-col sm:flex-row bg-[#050505] border border-white/5 p-2 rounded-[28px] md:rounded-[32px] gap-2 md:gap-3 shadow-inner group/input focus-within:border-[#b91c1c]/30 transition-all">
                            <div className="flex-1 flex items-center px-4 md:px-6 overflow-hidden">
                                <LinkIcon className="w-5 h-5 text-slate-800 shrink-0 mr-3 md:mr-4 italic" />
                                <input
                                    readOnly
                                    value={referralLink}
                                    className="bg-transparent w-full text-[12px] font-black text-slate-700 outline-none truncate italic uppercase tracking-wider"
                                />
                            </div>
                            <button
                                onClick={copyLink}
                                className={`h-14 md:h-16 px-8 md:px-10 rounded-[20px] md:rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center justify-center gap-3 md:gap-4 transition-all italic active:scale-95 ${copied ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-950/40' : 'bg-[#b91c1c] text-white hover:bg-[#991b1b] shadow-2xl shadow-red-950/40'
                                    }`}
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'COPIED' : 'COPY LINK'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 animate-reveal">
                {[
                    { label: "Available Earnings", value: `₹${stats?.affiliateBalance?.toFixed(2)}`, icon: Wallet, color: "red" },
                    { label: "Total Referrals", value: stats?.referralsCount, icon: Users, color: "red" },
                    { label: "Lifetime Profit", value: `₹${stats?.totalEarnings?.toFixed(2)}`, icon: Activity, color: "red" }
                ].map((s, idx) => (
                    <div key={idx} className="bg-[#0a0a0c] border border-white/[0.03] p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl flex flex-col gap-8 md:gap-10 group hover:border-[#b91c1c]/20 transition-all shadow-inner">
                        <div className="w-16 md:w-20 h-16 md:h-20 rounded-[20px] md:rounded-[28px] bg-[#050505] text-[#b91c1c] flex items-center justify-center border border-white/5 shadow-2xl group-hover:bg-[#b91c1c]/10 transition-all">
                            <s.icon className="w-8 md:w-10 h-8 md:h-10 italic" />
                        </div>
                        <div className="space-y-1 md:space-y-3">
                            <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 italic leading-none">{s.label}</p>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none italic">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div className="bg-[#0a0a0c] border border-white/[0.03] p-8 md:p-12 rounded-[40px] md:rounded-[56px] shadow-2xl shadow-inner">
                <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
                    <div className="flex-1 space-y-8 md:space-y-12">
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4 md:gap-6 italic">
                            <Zap className="w-8 md:w-10 h-8 md:h-10 text-[#b91c1c]" />
                            How it <span className="text-[#b91c1c]">Works</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
                            {[
                                { t: "Share link", d: "Users join using your unique referral link", step: "01" },
                                { t: "Users order", d: "They place any SMM orders on the site", step: "02" },
                                { t: "Get Profit", d: "5% of their recharge is credited to you", step: "03" }
                            ].map((step, i) => (
                                <div key={i} className="space-y-4 md:space-y-6">
                                    <div className="w-12 md:w-14 h-12 md:h-14 rounded-[18px] md:rounded-[22px] bg-[#050505] text-[#b91c1c] flex items-center justify-center font-black text-sm italic border border-white/5">{step.step}</div>
                                    <div className="space-y-1.5 md:space-y-3">
                                        <p className="text-[13px] md:text-[14px] font-black text-white uppercase italic leading-none">{step.t}</p>
                                        <p className="text-[9px] md:text-[10px] text-slate-800 font-black uppercase tracking-[0.1em] leading-relaxed italic">{step.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hidden lg:block w-[1px] h-40 bg-white/[0.03]"></div>
                    <div className="p-8 md:p-12 bg-[#b91c1c] rounded-[32px] md:rounded-[48px] shadow-2xl shadow-red-950/40 w-full lg:max-w-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                        <div className="flex items-center gap-6 mb-6 md:mb-8">
                            <Shield className="w-7 md:w-8 h-7 md:h-8 text-white" />
                            <p className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Security Rules</p>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-white/70 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                            Minimum payout threshold is ₹500. Profits are credited instantly. Multi-accounting or self-referrals will cause account termination.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Earnings Table */}
            <div className="space-y-8 md:space-y-10 animate-reveal">
                <div className="flex items-center justify-between px-4 md:px-8">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4 italic leading-none">
                        <TrendingUp className="w-6 h-6 text-[#b91c1c] italic" />
                        Recent <span className="text-[#b91c1c]">Earnings</span>
                    </h2>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none hidden sm:block">Earnings_Log</span>
                </div>

                <div className="bg-[#0a0a0c] border border-white/[0.03] overflow-hidden rounded-[32px] md:rounded-[56px] shadow-2xl shadow-inner italic">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#050505]/60 border-b border-white/[0.03]">
                                <tr>
                                    <th className="p-6 md:p-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] italic">Date</th>
                                    <th className="p-6 md:p-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] italic">User</th>
                                    <th className="p-6 md:p-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] italic">Amount</th>
                                    <th className="p-6 md:p-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] text-right italic">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {stats?.recentTransactions?.length > 0 ? stats.recentTransactions.map((tx: any) => (
                                    <tr key={tx._id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="p-6 md:p-10">
                                            <div className="flex flex-col gap-1.5 md:gap-2">
                                                <span className="text-[12px] md:text-[13px] font-black text-white italic leading-none">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase italic opacity-40 leading-none">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 md:p-10">
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="w-10 md:w-12 h-10 md:h-12 bg-[#050505] rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                                    <Users className="w-4 md:w-5 h-4 md:h-5 text-[#b91c1c] italic" />
                                                </div>
                                                <span className="text-[12px] md:text-[13px] font-black text-slate-400 truncate max-w-[100px] md:max-w-[150px] uppercase italic">{(tx.referred_user_id as any)?.email?.split('@')[0] || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 md:p-10">
                                            <div className="flex flex-col gap-1.5 md:gap-2">
                                                <p className="text-[14px] md:text-[16px] font-black text-[#b91c1c] italic leading-none">+ ₹{tx.amount.toFixed(2)}</p>
                                                <span className="text-[8px] md:text-[9px] font-black text-slate-950 uppercase italic opacity-40 leading-none tracking-widest italic">5% CREDIT</span>
                                            </div>
                                        </td>
                                        <td className="p-6 md:p-10 text-right">
                                            <span className="px-4 md:px-5 py-1.5 md:py-2.5 bg-emerald-500/5 text-emerald-500 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-emerald-500/10 italic">VERIFIED</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="p-20 md:p-32 text-center">
                                            <div className="w-20 md:w-24 h-20 md:h-24 bg-[#050505] rounded-[32px] md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-8 border border-white/5 shadow-2xl">
                                                <TrendingUp className="w-8 md:w-10 h-8 md:h-10 text-slate-900 italic" />
                                            </div>
                                            <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none">No earnings history found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
