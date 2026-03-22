"use client";

import { User, Mail, Shield, Smartphone, Key, Save, UserCheck, Zap, RefreshCcw, Camera, Lock, Wallet, CreditCard, Activity, Target, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
    const { refreshUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setEmail(data.user.email);
                    setAvatar(data.user.avatar || "");
                    setPhone(data.user.phone || "");
                }
            } catch (err) {
                console.error("Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleUpdateProfile = async (updates: any = {}) => {
        setUpdating(true);
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    oldPassword,
                    newPassword,
                    avatar,
                    phone,
                    ...updates
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                if (data.apiKey) setUser({ ...user, apiKey: data.apiKey });
                setOldPassword("");
                setNewPassword("");
                await refreshUser();
            } else {
                alert(data.message);
            }
        } catch (e) { alert("Update failed"); }
        setUpdating(false);
    };

    const handleRegenerateKey = () => {
        if (confirm("Regenerate API Key? Your old key will stop working immediately.")) {
            handleUpdateProfile({ regenerateKey: true });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 md:py-64 gap-8 md:gap-10 italic">
            <div className="w-10 md:w-12 h-10 md:h-12 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin italic"></div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.6em] animate-pulse leading-none italic">Synchronizing...</p>
        </div>
    );

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
                        Account <span className="text-[#b91c1c]">Settings</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Manage your profile and security credentials
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 md:gap-12 items-start italic">
                {/* Profile Card */}
                <div className="space-y-8 md:space-y-10 animate-reveal">
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center group shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#b91c1c]"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#b91c1c]/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-[#b91c1c]/10 transition-all duration-1000"></div>

                        <div className="w-32 md:w-48 h-32 md:h-48 rounded-full border-[6px] md:border-[10px] border-[#050505] bg-[#050505] mx-auto overflow-hidden shadow-2xl mb-8 md:mb-12 relative z-10 transition-all duration-700 italic">
                            <img src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 italic" alt="Profile" />
                        </div>

                        <div className="space-y-2 md:space-y-3 z-10">
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{user?.email?.split('@')[0]}</h3>
                            <p className="text-[10px] md:text-[11px] font-black text-[#b91c1c] uppercase tracking-[0.2em] leading-none italic">{user?.email}</p>
                        </div>

                        <div className="w-full mt-10 md:mt-14 pt-10 md:pt-14 border-t border-white/[0.03] space-y-8 md:space-y-10 z-10">
                            <div className="flex items-center justify-between p-6 md:p-8 bg-[#050505] rounded-[32px] md:rounded-[38px] border border-white/[0.02] shadow-inner italic">
                                <div className="text-left space-y-1 md:space-y-2">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">Total Balance</p>
                                    <p className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none italic">₹{user?.balance?.toFixed(2)}</p>
                                </div>
                                <div className="w-14 md:w-16 h-14 md:h-16 rounded-2xl md:rounded-[22px] bg-[#b91c1c]/5 text-[#b91c1c] flex items-center justify-center border border-[#b91c1c]/10 shadow-2xl shadow-red-950/20 italic">
                                    <Wallet className="w-7 md:w-8 h-7 md:h-8 italic" />
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6 text-left italic">
                                <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.6em] mb-1 px-4 leading-none italic opacity-60">Your API Key</p>
                                <div className="flex items-center gap-4 md:gap-6 bg-[#050505] p-6 md:p-8 rounded-[32px] md:rounded-[38px] border border-white/[0.02] shadow-inner italic">
                                    <span className="text-[10px] md:text-[11px] font-black text-slate-800 truncate flex-1 uppercase tracking-[0.1em] md:tracking-[0.2em] italic">{user?.apiKey || "SYNCING..."}</span>
                                    <button 
                                        onClick={handleRegenerateKey} 
                                        className="w-10 md:w-12 h-10 md:h-12 bg-[#b91c1c]/10 text-[#b91c1c] rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#b91c1c] hover:text-white transition-all shadow-2xl border border-[#b91c1c]/10 active:rotate-180 duration-500 italic"
                                    >
                                        <RefreshCcw className="w-4 md:w-5 h-4 md:h-5 italic" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#b91c1c] rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-white flex items-center gap-6 md:gap-10 shadow-2xl shadow-red-950/40 relative overflow-hidden italic transition-all active:scale-[0.99]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
                        <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-3xl shrink-0 shadow-2xl border border-white/10 italic">
                            <Activity className="w-8 md:w-10 h-8 md:h-10 text-white italic" />
                        </div>
                        <div className="space-y-1.5 md:space-y-2 relative z-10 leading-none italic">
                            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/60 mb-1 md:mb-2 italic">Account Tier</p>
                            <p className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none italic">ELITE MEMBER</p>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="space-y-8 md:space-y-12 animate-reveal italic">
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[48px] md:rounded-[64px] p-8 md:p-20 shadow-2xl relative overflow-hidden group shadow-inner italic">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b91c1c]/5 rounded-full blur-[150px] -mr-48 -mt-48 transition-all duration-1000"></div>

                        <div className="relative z-10 space-y-14 md:space-y-20 italic">
                            {/* General Info */}
                            <div className="space-y-8 md:space-y-10 italic">
                                <div className="flex items-center gap-6 md:gap-8 border-b border-white/[0.03] pb-8 md:pb-10 italic">
                                    <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-[22px] bg-[#b91c1c]/5 text-[#b91c1c] flex items-center justify-center border border-[#b91c1c]/10 shadow-2xl italic">
                                        <User className="w-6 md:w-7 h-6 md:h-7 italic" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none italic">Personal <span className="text-[#b91c1c]">Information</span></h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 md:gap-12 italic">
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Avatar Image URL</label>
                                        <div className="relative group/input italic">
                                            <Camera className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-900 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                                            <input
                                                type="text"
                                                value={avatar}
                                                onChange={(e) => setAvatar(e.target.value)}
                                                placeholder="https://example.com/avatar.jpg"
                                                className="w-full h-16 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner placeholder:text-slate-950 tracking-wider italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Email Address</label>
                                        <div className="relative group/input italic">
                                            <Mail className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-900 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-16 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner tracking-wider italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Phone Number</label>
                                        <div className="relative group/input italic">
                                            <Smartphone className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-900 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full h-16 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner tracking-widest italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="space-y-8 md:space-y-10 pt-12 md:pt-16 border-t border-white/[0.03] italic">
                                <div className="flex items-center gap-6 md:gap-8 border-b border-white/[0.03] pb-8 md:pb-10 italic">
                                    <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-[22px] bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-500/10 shadow-2xl italic">
                                        <ShieldCheck className="w-6 md:w-7 h-6 md:h-7 italic" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none italic">Privacy <span className="text-[#b91c1c]">& Security</span></h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 md:gap-12 italic">
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">Current Password</label>
                                        <div className="relative group/input italic">
                                            <Lock className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-900 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-16 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner tracking-[0.6em] md:tracking-[0.8em] placeholder:text-slate-950 italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">New Password</label>
                                        <div className="relative group/input italic">
                                            <Key className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-900 group-focus-within/input:text-[#b91c1c] transition-colors italic" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-16 md:h-20 bg-[#050505] border border-white/5 rounded-2xl md:rounded-3xl pl-16 md:pl-20 pr-6 md:pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner tracking-[0.6em] md:tracking-[0.8em] placeholder:text-slate-950 italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleUpdateProfile()}
                                disabled={updating}
                                className="w-full md:w-auto h-20 md:h-24 px-12 md:px-16 bg-[#b91c1c] text-white rounded-[32px] md:rounded-[40px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[12px] md:text-[14px] flex items-center justify-center gap-4 md:gap-6 shadow-2xl shadow-red-950/50 hover:bg-[#991b1b] transition-all disabled:opacity-50 group active:scale-95 italic"
                            >
                                {updating ? <RefreshCcw className="w-6 md:w-8 h-6 md:h-8 animate-spin italic" /> : <Save className="w-6 md:w-8 h-6 md:h-8 italic" />}
                                {updating ? "UPDATING..." : "SAVE CHANGES"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
