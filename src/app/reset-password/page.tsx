"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!token) {
            setError("Invalid reset link. Please request a new one.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden bg-[#1A2332] font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[100px] -z-10"></div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 rounded-[22px] overflow-hidden mb-6 border-b-4 border-blue-500 shadow-xl bg-[#131B2B] p-3">
                        <img src="/brand-logo.png" alt="SMM12 Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-200 tracking-tighter uppercase leading-none">
                        SMM<span className="text-[#4194FF]">12</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] mt-3 font-black uppercase tracking-[0.4em]">Security Update</p>
                </div>

                <div className="bg-[#131B2B] p-10 border border-[#2A3A5A] rounded-[48px] shadow-2xl relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                    {success ? (
                        <div className="space-y-6 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mx-auto mb-4 border border-green-100">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-200 uppercase italic">Access Restored!</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                Password updated successfully.<br />Redirecting to login portal...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-black text-slate-200 uppercase tracking-tighter italic">Update Password</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Finalize your secure credentials</p>
                            </div>

                            {error && (
                                <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 flex items-center justify-center gap-3 text-red-500">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full h-16 bg-[#1A2332] border border-[#2A3A5A] rounded-[24px] pl-16 pr-6 text-slate-200 outline-none focus:border-blue-500/50 focus:bg-[#131B2B] font-bold placeholder-slate-300 transition-all shadow-sm focus:shadow-md"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Confirm Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full h-16 bg-[#1A2332] border border-[#2A3A5A] rounded-[24px] pl-16 pr-6 text-slate-200 outline-none focus:border-blue-500/50 focus:bg-[#131B2B] font-bold placeholder-slate-300 transition-all shadow-sm focus:shadow-md"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full h-16 bg-[#4194FF] text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-4 disabled:opacity-50 mt-4"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save New Credentials"}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 opacity-80 uppercase tracking-widest text-[9px] font-black">
                    <ShieldCheck className="w-4 h-4" />
                    Fully Secure Tokenized Reset
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#131B2B] text-[#4194FF] font-bold uppercase tracking-widest text-[10px] flex-col gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            Loading Page...
        </div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
