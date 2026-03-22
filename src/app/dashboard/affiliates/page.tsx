"use client";

import { Share2, Users, Wallet, TrendingUp, Sparkles, ArrowRight, Zap, ShieldCheck, Target } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";

export default function AffiliatesPage() {
    const { user } = useAuth();
    const userName = user?.email?.split('@')[0] || "USER";

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10 md:mb-14 space-y-2 md:space-y-3"
            >
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Affiliate <span className="text-[#b91c1c]">Program</span></h1>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] animate-pulse"></div>
                    <p className="text-slate-800 text-[10px] font-black tracking-[0.4em] uppercase leading-none italic">Earn money by referring friends.</p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr, 400px] gap-8 md:gap-12 items-start">

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8 md:space-y-12"
                >

                    {/* Hero Stats Section */}
                    <div className="bg-[#0a0a0c] rounded-[32px] md:rounded-[48px] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden group shadow-inner">
                        <div className="absolute top-0 right-0 w-[60%] h-full bg-[#b91c1c]/5 blur-[100px] -z-10 rotate-12 group-hover:bg-[#b91c1c]/10 transition-all duration-700"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
                            <div className="space-y-2 md:space-y-3">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">COMMISSION RATE</p>
                                <p className="text-5xl md:text-6xl font-black text-[#b91c1c] italic tracking-tighter leading-none">5%</p>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none italic">Per Valid Order</p>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">MINIMUM PAYOUT</p>
                                <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none">₹500.00</p>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none italic">Available Balance</p>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">LIMIT</p>
                                <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none uppercase">LIFETIME</p>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none italic">Recursive Earnings</p>
                            </div>
                        </div>

                        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/[0.03]">
                            <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] ml-2 italic">YOUR REFERRAL LINK</label>
                            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 h-14 md:h-16 bg-[#050505] border border-white/5 rounded-2xl flex items-center px-6 md:px-8 text-[#b91c1c] font-black text-[13px] md:text-sm truncate uppercase tracking-widest shadow-inner italic">
                                    https://smm12.com/signup?ref={userName.toUpperCase()}
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { navigator.clipboard.writeText(`https://smm12.com/signup?ref=${userName.toUpperCase()}`); alert("Link copied!"); }} 
                                    className="h-14 md:h-16 px-10 md:px-12 bg-[#b91c1c] text-white rounded-[20px] font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-[#991b1b] shadow-2xl shadow-red-950/40 transition-all italic active:scale-95"
                                >
                                    Copy Link
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* How it Works */}
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { i: Share2, t: "Share Link", d: "Send your referral link to friends or clients." },
                            { i: Users, t: "Users Join", d: "New users register using your link automatically." },
                            { i: Wallet, t: "Earn Money", d: "Receive 5% commission on every recharge they make." }
                        ].map((step, i) => (
                            <motion.div 
                                whileHover={{ y: -5 }}
                                key={i} 
                                className="bg-[#0a0a0c] p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 space-y-6 md:space-y-8 group hover:border-[#b91c1c]/20 transition-all shadow-2xl shadow-inner italic"
                            >
                                <div className="w-14 md:w-16 h-14 md:h-16 rounded-[20px] md:rounded-[22px] bg-[#050505] flex items-center justify-center text-slate-800 group-hover:bg-[#b91c1c] group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500 border border-white/5">
                                    <step.i className="w-7 md:w-8 h-7 md:h-8" />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{step.t}</h4>
                                    <p className="text-[10px] md:text-[11px] text-slate-800 font-black leading-relaxed uppercase tracking-[0.2em] opacity-80 italic">{step.d}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Affiliate Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8 md:space-y-10"
                >
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-[40px] md:rounded-[48px] p-10 md:p-12 space-y-10 md:space-y-12 shadow-2xl group shadow-inner italic">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#b91c1c]/5 flex items-center justify-center border border-[#b91c1c]/10 group-hover:scale-110 transition-transform duration-500">
                                <TrendingUp className="w-7 h-7 text-[#b91c1c]" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">YOUR STATS</h3>
                        </div>

                        <div className="space-y-8 md:space-y-10 py-6 border-t border-white/[0.03]">
                            <div className="flex justify-between items-center px-2 group/stat transition-all">
                                <div className="flex items-center gap-4 text-slate-800 group-hover/stat:text-[#b91c1c] transition-colors italic">
                                    <Users className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">VISITS</span>
                                </div>
                                <span className="text-2xl font-black text-white italic tracking-tighter leading-none">0</span>
                            </div>
                            <div className="flex justify-between items-center px-2 group/stat transition-all">
                                <div className="flex items-center gap-4 text-slate-800 group-hover/stat:text-[#b91c1c] transition-colors italic">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">SIGNUPS</span>
                                </div>
                                <span className="text-2xl font-black text-white italic tracking-tighter leading-none">0</span>
                            </div>
                            <div className="flex justify-between items-center px-2 group/stat transition-all">
                                <div className="flex items-center gap-4 text-slate-800 group-hover/stat:text-[#b91c1c] transition-colors italic">
                                    <Wallet className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">PROFIT</span>
                                </div>
                                <span className="text-3xl font-black text-[#b91c1c] italic tracking-tighter leading-none">₹0.00</span>
                            </div>
                        </div>

                        <button className="w-full h-16 border border-white/[0.03] rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[0.3em] text-slate-900 bg-white/[0.01] transition-all opacity-40 cursor-not-allowed italic">
                            Request Payout
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-10 bg-[#b91c1c]/5 border border-[#b91c1c]/10 rounded-[40px] flex items-center gap-8 shadow-2xl relative overflow-hidden group shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#b91c1c]/10 to-transparent pointer-events-none"></div>
                        <div className="w-16 h-16 rounded-[22px] bg-[#b91c1c] flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:rotate-12 transition-transform duration-500">
                            <ShieldCheck className="w-8 h-8 text-white italic" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase leading-relaxed tracking-[0.3em] italic opacity-60 relative z-10">
                            FRAUD PROTECTION ACTIVE. NO CHEATING.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
