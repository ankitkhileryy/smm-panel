"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Reset link sent! Please check your email inbox.");
            } else {
                setError(data.message || "Failed to process request");
            }
        } catch (err) {
            setError("Connection Error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden bg-[#1A2332] font-sans">
            {/* Soft Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[100px] -z-10"></div>

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 rounded-[22px] overflow-hidden mb-6 border-b-4 border-blue-500 shadow-xl bg-[#131B2B] p-3">
                        <img src="/brand-logo.png" alt="SMM12 Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-200 tracking-tighter uppercase leading-none">
                        SMM<span className="text-[#4194FF]">12</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] mt-3 font-black uppercase tracking-[0.4em]">Recovery Portal</p>
                </div>

                <div className="bg-[#131B2B] p-10 border border-[#2A3A5A] rounded-[48px] shadow-2xl relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-xl font-black text-slate-200 uppercase tracking-tighter italic">Found Access?</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Enter your email to receive recovery link</p>
                    </div>

                    {message && (
                        <div className="mb-8 rounded-2xl bg-green-50 border border-green-100 p-4 text-green-600 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-3">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-8 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-500 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-3">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Email Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="yourname@domain.com"
                                    className="w-full h-16 bg-[#1A2332] border border-[#2A3A5A] rounded-[24px] pl-16 pr-6 text-slate-200 outline-none focus:border-blue-500/50 focus:bg-[#131B2B] font-bold placeholder-slate-300 transition-all shadow-sm focus:shadow-md"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 mt-4 bg-[#4194FF] text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Send Reset Instructions
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center pt-8 border-t border-[#2A3A5A]">
                        <Link href="/login" className="text-[11px] font-black text-[#4194FF] hover:text-blue-700 uppercase tracking-[0.3em] transition-colors">
                            Back To Credentials Login
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 opacity-80 uppercase tracking-widest text-[9px] font-black">
                    <ShieldCheck className="w-4 h-4" />
                    Fully Secure Password Management
                </div>
            </div>
        </div>
    );
}


