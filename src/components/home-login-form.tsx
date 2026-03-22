"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeLoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
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
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err: any) {
            setError("Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignIn} className="space-y-8 md:space-y-10 relative z-10 w-full font-sans italic px-2">
            <div className="text-center mb-8 md:mb-12 italic leading-none">
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-2 md:mb-4 leading-none italic">Welcome Back</h3>
                <p className="text-[9px] md:text-[10px] text-slate-800 font-black tracking-[0.4em] md:tracking-[0.5em] uppercase leading-none italic">Login to your account</p>
            </div>

            <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 md:p-6 bg-red-950/10 border border-red-950/20 rounded-2xl md:rounded-[28px] text-red-500 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 shadow-inner italic"
                >
                    <AlertCircle className="w-4 md:w-5 h-4 md:h-5 shrink-0 italic" />
                    {error}
                </motion.div>
            )}
            </AnimatePresence>

            <div className="space-y-6 md:space-y-8 italic">
                <div className="space-y-3 md:space-y-4 italic">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-900 tracking-[0.3em] md:tracking-[0.4em] uppercase ml-2 md:ml-4 leading-none italic">Email Address</label>
                    <div className="relative group/input italic">
                        <Mail className="w-4 md:w-5 h-4 md:h-5 text-slate-950 absolute left-6 md:left-8 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-18 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-white text-[12px] md:text-[13px] font-black outline-none focus:border-[#b91c1c]/40 transition-all placeholder-slate-950 shadow-inner italic"
                        />
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4 italic">
                    <div className="flex justify-between items-center px-2 md:px-4 italic">
                        <label className="text-[9px] md:text-[10px] font-black text-slate-900 tracking-[0.3em] md:tracking-[0.4em] uppercase leading-none italic">Password</label>
                    </div>
                    <div className="relative group/input italic">
                        <Lock className="w-4 md:w-5 h-4 md:h-5 text-slate-950 absolute left-6 md:left-8 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-18 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-white text-[12px] md:text-[13px] font-black outline-none focus:border-[#b91c1c]/40 transition-all tracking-[0.6em] md:tracking-[0.8em] placeholder-slate-950 shadow-inner italic"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-20 md:h-24 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-[32px] md:rounded-[40px] font-black text-[13px] md:text-[15px] disabled:opacity-50 flex items-center justify-center gap-4 md:gap-6 mt-2 md:mt-4 transition-all shadow-2xl shadow-red-950/40 tracking-[0.3em] md:tracking-[0.4em] uppercase active:scale-95 italic"
            >
                {loading ? (
                    <Loader2 className="w-7 md:w-8 h-7 md:h-8 animate-spin italic" />
                ) : (
                    <>
                        Login Now
                        <ArrowRight className="w-5 md:w-6 h-5 md:h-6 transition-transform italic" />
                    </>
                )}
            </button>

            <div className="text-center mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/[0.03] italic">
                <Link href="/signup" className="text-[10px] md:text-[11px] text-slate-900 hover:text-white transition-all uppercase tracking-[0.3em] md:tracking-[0.4em] font-black italic">
                    Don&apos;t have an account? <span className="text-[#b91c1c] underline decoration-2 underline-offset-8 italic">Sign Up</span>
                </Link>
            </div>
        </form>
    );
}
