"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Wallet, ShieldCheck, AlertCircle, CheckCircle2, Zap, ArrowRight, RefreshCcw, CreditCard, Smartphone, Shield, Target, Activity } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AddFundsPage() {
    const { user, refreshUser } = useAuth();
    const [amount, setAmount] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [polling, setPolling] = useState(false);

    const searchParams = useSearchParams();

    // If redirected back with status=check, start polling
    useEffect(() => {
        const status = searchParams.get("status");
        const id = searchParams.get("id");
        if (status === "check" && id) {
            setPolling(true);
            setLoading(true);
            checkStatus(id);
        }
    }, [searchParams]);

    const checkStatus = async (id: string) => {
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await fetch("/api/payments/phonepe/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ merchantTransactionId: id }),
                });
                const data = await res.json();
                
                if (data.payment_status === "Completed") {
                    clearInterval(interval);
                    setMessage({ type: "success", text: "Funds added successfully!" });
                    await refreshUser();
                    setTimeout(() => {
                        setPolling(false);
                        setLoading(false);
                        window.history.replaceState(null, '', '/dashboard/add-funds');
                    }, 2000);
                } else if (data.payment_status === "Failed") {
                    clearInterval(interval);
                    setMessage({ type: "error", text: "Payment failed. Please try again." });
                    setTimeout(() => {
                        setPolling(false);
                        setLoading(false);
                        window.history.replaceState(null, '', '/dashboard/add-funds');
                    }, 5000);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setMessage({ type: "error", text: "Update taking longer than expected. Please check your wallet balance in a few minutes." });
                    setPolling(false);
                    setLoading(false);
                }
            } catch (err: any) {
                console.error("Status check failed:", err);
            }
        }, 3000);
    };

    const handlePayment = async () => {
        if (!amount || amount < 10) {
            alert("Minimum amount is ₹10");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Create PhonePe Order
            const res = await fetch("/api/payments/phonepe/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to initiate payment");

            if (data.url) {
                // Redirect user to PhonePe payment page
                window.location.href = data.url;
            } else {
                throw new Error("PhonePe URL not found");
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-16 font-sans overflow-x-hidden px-4 md:px-0">
            {/* PhonePe Merchant Integration */}
            
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-8 md:pb-10 border-b border-white/[0.03] italic"
            >
                <div className="space-y-2 md:space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Add <span className="text-[#b91c1c]">Funds</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse italic"></div>
                         <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Secure UPI Gateway • Instant Activation
                         </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-6 md:px-8 py-3 md:py-3.5 bg-[#0a0a0c] rounded-xl md:rounded-[22px] border border-white/[0.05] shadow-2xl shadow-inner italic">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 italic" />
                    <span className="text-[10px] md:text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">BANK GRADE SECURITY</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 md:gap-12 items-start">
                {/* Left Side: The Main Gateway Box */}
                <div className="animate-reveal italic">
                    <div className="bg-[#0a0a0c] rounded-[40px] md:rounded-[48px] p-8 md:p-16 border border-white/[0.03] shadow-2xl relative overflow-hidden group shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#b91c1c]"></div>
                        <div className="absolute -right-32 -top-32 w-80 h-80 bg-[#b91c1c]/5 blur-[100px] rounded-full group-hover:bg-[#b91c1c]/10 transition-all duration-1000"></div>

                        <AnimatePresence mode="wait">
                        {!polling ? (
                            <motion.div 
                                key="input"
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.5 }}
                                className="space-y-10 md:space-y-14 italic"
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 border-b border-white/[0.03] pb-8 md:pb-10 italic">
                                    <div className="flex -space-x-4 md:-space-x-5 italic">
                                        <div className="w-14 md:w-16 h-14 md:h-16 rounded-xl md:rounded-2xl border-[3px] md:border-[4px] border-[#0a0a0c] bg-[#5f259f] flex items-center justify-center font-black text-white shadow-2xl z-20 italic text-sm">Pe</div>
                                        <div className="w-14 md:w-16 h-14 md:h-16 rounded-xl md:rounded-2xl border-[3px] md:border-[4px] border-[#0a0a0c] bg-white text-slate-900 flex items-center justify-center font-black shadow-2xl z-11 scale-105"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-6 md:w-7" /></div>
                                        <div className="w-14 md:w-16 h-14 md:h-16 rounded-xl md:rounded-2xl border-[3px] md:border-[4px] border-[#0a0a0c] bg-[#002970] flex items-center justify-center font-black text-white shadow-2xl italic text-sm">Pt</div>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2 text-center sm:text-left italic">
                                        <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest italic leading-none">Choose Payment App</h3>
                                        <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">ZERO FEES • INSTANT SETTLEMENT</p>
                                    </div>
                                </div>

                                <div className="space-y-8 md:space-y-10 italic">
                                    <div className="space-y-4 md:space-y-5">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] ml-2 leading-none italic">ENTER AMOUNT</label>
                                        <div className="relative group italic">
                                            <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-3xl md:text-4xl font-black text-slate-900 group-focus-within:text-[#b91c1c] transition-colors italic">₹</div>
                                            <input
                                                type="number"
                                                placeholder="Min: 10"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full h-24 md:h-28 bg-[#050505] border border-white/5 rounded-[32px] md:rounded-[38px] pl-16 md:pl-20 pr-8 md:pr-10 text-4xl md:text-5xl font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner placeholder:text-slate-950 italic tracking-tighter"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-3 md:gap-4 pt-4 px-2 italic">
                                            {[50, 100, 500, 1000, 2000].map(val => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setAmount(val)}
                                                    className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] transition-all border uppercase italic active:scale-95 ${amount === val
                                                        ? "bg-[#b91c1c] border-[#b91c1c] text-white shadow-2xl shadow-red-950/40"
                                                        : "bg-[#050505] border-white/5 text-slate-800 hover:text-white hover:border-[#b91c1c]/20"
                                                    }`}
                                                >
                                                    + ₹{val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 italic">
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading || !amount}
                                        className="w-full h-20 md:h-24 bg-[#b91c1c] text-white rounded-[28px] md:rounded-[32px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[13px] md:text-[15px] shadow-2xl shadow-red-950/40 transition-all disabled:opacity-50 flex items-center justify-center gap-4 md:gap-6 group hover:bg-[#991b1b] active:scale-95 italic"
                                    >
                                        {loading ? <RefreshCcw className="w-7 md:w-8 h-7 md:h-8 animate-spin italic" /> : (
                                            <>
                                                Proceed to Pay
                                                <ArrowRight className="w-5 md:w-6 h-5 md:h-6 transition-transform italic" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center italic leading-none opacity-60">Automatic redirection on mobile devices</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="polling"
                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                className="flex flex-col items-center justify-center py-6 md:py-10 text-center space-y-10 md:space-y-12 italic"
                            >
                                <div className="relative italic">
                                    <div className="w-32 md:w-40 h-32 md:h-40 border-[8px] md:border-[10px] border-[#b91c1c]/30 rounded-full flex items-center justify-center relative z-10 shadow-inner italic">
                                        <div className="w-24 md:w-32 h-24 md:h-32 border-[8px] md:border-[10px] border-[#b91c1c] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(185,28,28,0.3)] italic">
                                            <RefreshCcw className="w-8 md:w-12 h-8 md:h-12 text-[#b91c1c] animate-spin italic" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 md:space-y-6 italic">
                                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Verifying Payment</h3>
                                    <p className="text-[12px] md:text-sm text-slate-800 font-black uppercase tracking-widest px-4 md:px-6 leading-relaxed italic opacity-80">Please complete the payment of <b className="text-white">₹{amount}</b> in your UPI app. Do not refresh this page.</p>
                                    <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 italic">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] italic"></div>
                                        <p className="text-[10px] md:text-[11px] text-emerald-500 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">LIVE MONITOR ACTIVE</p>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`w-full p-6 rounded-3xl border ${message.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-red-500/5 border-red-500/20 text-red-500'} italic font-black uppercase text-xs tracking-widest`}>
                                        {message.text}
                                    </div>
                                )}

                                <button onClick={() => setPolling(false)} className="text-[10px] md:text-[11px] text-slate-900 hover:text-[#b91c1c] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all italic leading-none active:scale-95">
                                    Cancel Transaction
                                </button>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-8 md:space-y-10 italic">
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group shadow-inner italic">
                        <div className="w-14 md:w-16 h-14 md:h-16 rounded-[18px] md:rounded-[22px] bg-[#b91c1c]/10 flex items-center justify-center mb-8 md:mb-10 text-[#b91c1c] border border-[#b91c1c]/10 italic shadow-2xl shadow-red-950/10">
                            <Zap className="w-7 md:w-8 h-7 md:h-8 italic" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">Instant Activation</h3>
                        <p className="text-[10px] md:text-[11px] text-slate-800 font-black uppercase tracking-[0.2em] md:tracking-widest leading-relaxed italic opacity-80">
                            Our secure payment system monitors transactions in real-time. Your funds are credited instantly upon successful payment.
                        </p>
                    </div>

                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group shadow-inner italic">
                        <div className="w-14 md:w-16 h-14 md:h-16 rounded-[18px] md:rounded-[22px] bg-emerald-500/10 flex items-center justify-center mb-8 md:mb-10 text-emerald-500 border border-emerald-500/10 italic shadow-2xl shadow-emerald-950/10">
                            <Target className="w-7 md:w-8 h-7 md:h-8 italic" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">Zero Fees</h3>
                        <p className="text-[10px] md:text-[11px] text-slate-800 font-black uppercase tracking-[0.2em] md:tracking-widest leading-relaxed italic opacity-80">
                            We don't charge any extra fees for UPI deposits. You get 100% of the amount you pay in your SMM12 wallet.
                        </p>
                    </div>

                    <div className="bg-[#0a0a0c] rounded-[32px] md:rounded-[40px] p-8 md:p-10 border border-white/[0.03] shadow-inner italic">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center mb-8 md:mb-10 leading-none italic opacity-60">Supported Apps</p>
                        <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-10 gap-y-6 md:gap-y-8 italic">
                            {['PhonePe', 'GPay', 'Paytm', 'BHIM', 'Cred'].map(app => (
                                <span key={app} className="font-black text-slate-800 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic opacity-40">{app}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
