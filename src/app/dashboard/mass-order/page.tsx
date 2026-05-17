"use client";

import { useState } from "react";
import { List, ClipboardList, Send, AlertCircle, CheckCircle2, RefreshCcw, ArrowRight, Shield, Zap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MassOrderPage() {
    const { user, refreshUser } = useAuth();
    const [massData, setMassData] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const lines = massData.split("\n").filter(line => line.trim() !== "");
        const orders = lines.map(line => {
            const [serviceId, quantity, link] = line.split("|").map(s => s.trim());
            return { serviceId, quantity: parseInt(quantity), link };
        });

        try {
            const res = await fetch("/api/orders/mass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orders }),
            });

            const data = await res.json();
            setResult({ success: res.ok, ...data });
            if (res.ok) {
                setMassData("");
                await refreshUser();
            }
        } catch (error: any) {
            setResult({ success: false, message: "Network error or invalid format" });
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
                        Mass <span className="text-[#b91c1c]">Order</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse italic"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Bulk Processing Protocol Active
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 md:gap-12 items-start">
                {/* Main Mass Form */}
                <div className="animate-reveal italic">
                    <div className="bg-[#0a0a0c] rounded-[40px] md:rounded-[48px] p-8 md:p-14 border border-white/[0.03] shadow-2xl relative overflow-hidden group shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#b91c1c]"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 italic">
                            <div className="space-y-4 md:space-y-6 italic">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] ml-2 leading-none italic">ORDER PAYLOAD (SERVICE_ID | QUANTITY | LINK)</label>
                                <textarea
                                    value={massData}
                                    onChange={(e) => setMassData(e.target.value)}
                                    rows={8}
                                    required
                                    placeholder="104 | 1000 | https://instagram.com/user\n106 | 500 | https://facebook.com/post"
                                    className="w-full bg-[#050505] border border-white/5 rounded-[28px] md:rounded-[40px] p-8 md:p-10 text-[13px] md:text-[14px] font-black text-white outline-none focus:border-[#b91c1c]/40 transition-all resize-none shadow-inner uppercase tracking-wider leading-relaxed italic placeholder:text-slate-950"
                                />
                            </div>

                            <div className="bg-[#050505] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex items-center gap-6 italic">
                                <div className="w-12 h-12 bg-[#b91c1c]/10 rounded-xl flex items-center justify-center text-[#b91c1c]">
                                    <AlertCircle className="w-6 h-6 italic" />
                                </div>
                                <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-widest leading-relaxed italic">
                                    One order per line. Format must be exact. Incomplete lines will be ignored.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !massData.trim()}
                                className="w-full h-20 md:h-24 bg-[#b91c1c] text-white rounded-[28px] md:rounded-[32px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[13px] md:text-[14px] shadow-2xl shadow-red-950/40 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group hover:bg-[#991b1b] active:scale-95 italic"
                            >
                                {loading ? <RefreshCcw className="w-7 h-7 animate-spin italic" /> : (
                                    <>
                                        Submit Bulk Order
                                        <ArrowRight className="w-5 h-5 transition-transform italic" />
                                    </>
                                )}
                            </button>
                        </form>

                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-10 p-8 rounded-[32px] border ${result.success ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-red-500/5 border-red-500/20 text-red-500'} italic font-black uppercase text-xs tracking-widest leading-relaxed`}
                            >
                                {result.message}
                                {result.errors && result.errors.length > 0 && (
                                    <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                                        {result.errors.map((err: any, idx: number) => (
                                            <p key={idx} className="text-red-400 opacity-80 lowercase">Error: {err.error}</p>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8 md:space-y-10 italic">
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] p-8 md:p-10 shadow-2xl italic shadow-inner">
                        <div className="w-14 h-14 rounded-2xl bg-[#b91c1c]/10 flex items-center justify-center mb-8 text-[#b91c1c] border border-[#b91c1c]/10">
                            <Shield className="w-7 h-7 italic" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">Format Protocol</h3>
                        <p className="text-[10px] text-slate-800 font-black uppercase tracking-widest leading-relaxed italic opacity-80">
                            ID | QUANTITY | LINK<br/>
                            Example: 104 | 1000 | https://ig.com/user
                        </p>
                    </div>

                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] p-8 md:p-10 shadow-2xl italic shadow-inner">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 text-emerald-500 border border-emerald-500/10">
                            <Zap className="w-7 h-7 italic" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">Instant Validation</h3>
                        <p className="text-[10px] text-slate-800 font-black uppercase tracking-widest leading-relaxed italic opacity-80">
                            The system validates each line in real-time. Only valid service IDs and quantities will be processed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
