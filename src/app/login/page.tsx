"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck, Target, Activity, Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                await refreshUser();
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#050505] font-sans overflow-x-hidden selection:bg-red-900/30 text-slate-400 italic">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#b91c1c]/5 rounded-full blur-[150px] -z-10 rotate-12 italic"></div>
            <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0 opacity-[0.03] italic">
                <h1 className="text-[45vw] font-black text-white whitespace-nowrap tracking-tighter select-none uppercase italic leading-none">SMM</h1>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10 italic"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-12 md:mb-16 text-center italic">
                    <div 
                        className="w-20 md:w-24 h-20 md:h-24 rounded-[28px] md:rounded-[32px] overflow-hidden mb-8 md:mb-10 border border-white/5 shadow-2xl bg-[#0a0a0c] flex items-center justify-center text-[#b91c1c] shadow-red-950/20 italic"
                    >
                        <Shield className="w-12 md:w-14 h-12 md:h-14 italic" />
                    </div>
                    <div className="space-y-3 md:space-y-4 italic leading-none">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                            SMM<span className="text-[#b91c1c]">12</span>
                        </h1>
                        <div className="flex items-center justify-center gap-3 md:gap-4 italic leading-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] animate-pulse italic"></div>
                            <p className="text-slate-900 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none">MEMBER LOGIN</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0a0c] border border-white/[0.03] p-8 md:p-14 rounded-[40px] md:rounded-[56px] shadow-2xl relative overflow-hidden shadow-inner italic">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#b91c1c] italic"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 italic"></div>

                    <AnimatePresence>
                    {registered && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-8 md:mb-10 rounded-2xl md:rounded-[28px] bg-emerald-500/5 border border-emerald-500/10 p-5 md:p-6 text-emerald-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center flex items-center justify-center gap-3 md:gap-4 shadow-inner italic leading-none"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)] italic"></span>
                            ACCOUNT VERIFIED SUCCESSFULLY
                        </motion.div>
                    )}

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-8 md:mb-10 rounded-2xl md:rounded-[28px] bg-red-900/10 border border-red-950/20 p-5 md:p-6 text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center flex items-center justify-center gap-3 md:gap-4 shadow-inner italic leading-none"
                        >
                            <AlertCircle className="w-4 md:w-5 h-4 md:h-5 shrink-0 italic" />
                            {error}
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative z-10 italic">
                        <div className="space-y-4 md:space-y-6 italic">
                            <label className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] ml-2 md:ml-4 leading-none italic">Email Address</label>
                            <div className="relative group/input italic">
                                <Mail className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-950 group-focus-within/input:text-[#b91c1c] transition-colors pointer-events-none italic" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full h-18 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-white text-[12px] md:text-[13px] font-black outline-none focus:border-[#b91c1c]/40 transition-all placeholder-slate-950 shadow-inner italic leading-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6 italic">
                            <div className="flex justify-between items-center px-2 md:px-4 italic">
                                <label className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">Password</label>
                                <Link href="/forgot-password" hidden className="text-[9px] md:text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:underline underline-offset-6 md:underline-offset-8 decoration-2 italic">Forgot Password?</Link>
                            </div>
                            <div className="relative group/input italic">
                                <Lock className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-950 group-focus-within/input:text-[#b91c1c] transition-colors pointer-events-none italic" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••••••"
                                    className="w-full h-18 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-white text-[12px] md:text-[13px] outline-none focus:border-[#b91c1c]/40 transition-all tracking-[0.6em] md:tracking-[0.8em] placeholder-slate-950 shadow-inner italic leading-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-20 md:h-24 mt-6 md:mt-10 bg-[#b91c1c] text-white rounded-[32px] md:rounded-[40px] font-black text-[14px] md:text-[15px] uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-2xl shadow-red-950/50 hover:bg-[#991b1b] transition-all flex items-center justify-center gap-4 md:gap-6 disabled:opacity-50 italic active:scale-95 leading-none"
                        >
                            {loading ? (
                                <Loader2 className="w-7 md:w-8 h-7 md:h-8 animate-spin italic" />
                            ) : (
                                <>
                                    Login Now
                                    <ArrowRight className="w-5 md:w-6 h-5 md:h-6 italic leading-none" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 md:mt-16 text-center pt-8 md:pt-12 border-t border-white/[0.03] italic">
                        <Link href="/signup" className="text-[10px] md:text-[11px] font-black text-slate-900 hover:text-white uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all italic leading-none">
                            Don&apos;t have an account? <span className="text-[#b91c1c] font-black underline decoration-2 underline-offset-[10px] md:underline-offset-[12px] italic">Join Us</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-12 md:mt-16 flex items-center justify-center gap-4 md:gap-5 text-slate-950 uppercase tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[10px] font-black italic opacity-30 italic leading-none">
                    <ShieldCheck className="w-4 md:w-5 h-4 md:h-5 text-[#b91c1c]/40 italic" />
                    SECURED BY SMM12
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#050505] text-[#b91c1c] font-black uppercase tracking-[0.8em] text-xs flex-col gap-10 font-sans italic animate-pulse">
            <Activity className="w-12 h-12 text-[#b91c1c]" />
            Loading...
        </div>}>
            <LoginForm />
        </Suspense>
    );
}
