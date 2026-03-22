"use client";

import { useState, useEffect, useCallback } from "react";
import { Smartphone, RefreshCw, Zap, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Copy, Clock, Database, Server, Target, Activity, Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function OTPPage() {
    const { user, refreshUser } = useAuth();
    const [services, setServices] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState("");
    const [selectedServer, setSelectedServer] = useState("");
    const [activeOrders, setActiveOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [servRes, provRes] = await Promise.all([
                    fetch("/api/otp/proxy?action=getServices"),
                    fetch("/api/otp/proxy?action=getProviders")
                ]);

                if (servRes.ok) {
                    const servData = await servRes.json();
                    setServices(servData.services || []);
                }
                if (provRes.ok) {
                    const provData = await provRes.json();
                    setServers(provData.providers || []);
                }
            } catch (err) {
                console.error("Failed to load OTP data");
            }
        };
        loadInitialData();
    }, []);

    const updateActiveOrdersStatus = useCallback(async () => {
        if (activeOrders.length === 0) return;
        setStatusLoading(true);
        try {
            const updatedOrders = await Promise.all(
                activeOrders.map(async (order) => {
                    if (["FINISH", "CANCEL"].includes(order.status)) return order;
                    const res = await fetch(`/api/otp/proxy?action=getStatus&id=${order.id}&provider=${order.provider}`);
                    if (res.ok) {
                        const data = await res.json();
                        return { ...order, status: data.status, sms: data.sms || order.sms };
                    }
                    return order;
                })
            );
            setActiveOrders(updatedOrders);
        } catch (err) {
            console.error("Status check failed");
        } finally {
            setStatusLoading(false);
        }
    }, [activeOrders]);

    useEffect(() => {
        const interval = setInterval(updateActiveOrdersStatus, 5000);
        return () => clearInterval(interval);
    }, [updateActiveOrdersStatus]);

    const handleBuyNumber = async () => {
        if (!selectedService || !selectedServer) {
            alert("Please select both service and server");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/otp/proxy?action=getNumber", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service: selectedService, provider: selectedServer })
            });

            const data = await res.json();
            if (res.ok) {
                setActiveOrders(prev => [{
                    id: data.id,
                    number: data.number,
                    status: "PENDING",
                    service: selectedService,
                    provider: selectedServer,
                    price: data.price,
                    sms: null,
                    createdAt: new Date().toISOString()
                }, ...prev]);
                await refreshUser();
            } else {
                alert(data.message || "Failed to acquire number");
            }
        } catch (err) {
            alert("System error");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: string, provider: string) => {
        try {
            const res = await fetch(`/api/otp/proxy?action=setStatus&id=${id}&status=${action}&provider=${provider}`, { method: "POST" });
            if (res.ok) {
                updateActiveOrdersStatus();
            }
        } catch (err) {
            console.error("Action failed");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    };

    return (
        <div className="w-full space-y-8 md:space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-8 md:pb-10 border-b border-white/[0.03]"
            >
                <div className="space-y-2 md:space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        OTP <span className="text-[#b91c1c]">Services</span>
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse font-black italic"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Acquire virtual numbers for verification
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 md:gap-8 justify-between md:justify-end">
                    <div className="text-right space-y-1 md:space-y-2">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">Balance</p>
                        <p className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none italic">₹{user?.balance?.toFixed(2)}</p>
                    </div>
                    <div className="px-4 md:px-6 py-2 md:py-2.5 bg-[#b91c1c]/5 rounded-xl md:rounded-full border border-[#b91c1c]/10 flex items-center gap-3 md:gap-4 italic shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">CONNECTED</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 md:gap-12 items-start">
                {/* Configuration Panel */}
                <div className="space-y-8 md:space-y-10 animate-reveal">
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[48px] p-6 md:p-12 shadow-2xl relative overflow-hidden group shadow-inner italic">
                        <div className="space-y-6 md:space-y-8">
                            <div className="space-y-3 md:space-y-4">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">SERVICE</label>
                                <div className="relative italic">
                                    <Database className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 italic" />
                                    <select
                                        className="w-full h-14 md:h-18 bg-[#050505] border border-white/5 rounded-xl md:rounded-2xl pl-16 pr-8 text-[12px] md:text-[13px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all appearance-none uppercase italic tracking-wider shadow-inner"
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                    >
                                        <option value="">Choose Service...</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] ml-2 leading-none italic">SERVER</label>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    {servers.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedServer(s.id)}
                                            className={`p-4 md:p-6 rounded-[20px] md:rounded-[24px] border flex flex-col items-center gap-3 md:gap-4 transition-all italic active:scale-95 shadow-inner ${selectedServer === s.id
                                                    ? "bg-[#b91c1c] border-[#b91c1c] text-white shadow-2xl shadow-red-950/40"
                                                    : "bg-[#050505] border-white/5 text-slate-800 hover:border-[#b91c1c]/20 hover:text-white"
                                                }`}
                                        >
                                            <Server className={`w-5 md:w-6 h-5 md:h-6 italic ${selectedServer === s.id ? 'text-white' : 'text-[#b91c1c]'}`} />
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{s.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleBuyNumber}
                                disabled={loading || !selectedService || !selectedServer}
                                className="w-full h-16 md:h-20 bg-[#b91c1c] text-white rounded-2xl md:rounded-[28px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[11px] md:text-[13px] shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all disabled:opacity-50 flex items-center justify-center gap-4 md:gap-6 italic active:scale-95"
                            >
                                {loading ? <RefreshCw className="w-5 md:w-6 h-5 md:h-6 animate-spin" /> : (
                                    <>
                                        Get Number
                                        <Zap className="w-5 md:w-6 h-5 md:h-6" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[38px] space-y-3 md:space-y-4 shadow-inner italic">
                        <div className="flex items-center gap-3 md:gap-4">
                            <Shield className="w-4 md:w-5 h-4 md:h-5 text-[#b91c1c] italic" />
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">Important Notice</p>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-slate-800 font-black uppercase tracking-[0.1em] leading-relaxed italic opacity-80">
                            Numbers are valid for 20 minutes. Funds are refunded automatically if no OTP is received.
                        </p>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="space-y-8 md:space-y-10 animate-reveal">
                    <div className="flex items-center justify-between px-4 md:px-10 italic">
                        <h2 className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] flex items-center gap-4 md:gap-6 italic leading-none">
                            Active <span className="text-[#b91c1c]">Numbers</span>
                            {statusLoading && <RefreshCw className="w-4 h-4 text-[#b91c1c] animate-spin" />}
                        </h2>
                        <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] md:tracking-[0.3em] italic leading-none">{activeOrders.length} ACTIVE</span>
                    </div>

                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[40px] md:rounded-[56px] shadow-2xl overflow-hidden min-h-[400px] md:min-h-[500px] shadow-inner italic">
                        {activeOrders.length === 0 ? (
                            <div className="py-32 md:py-48 flex flex-col items-center justify-center text-center px-6 md:px-10">
                                <div className="w-20 md:w-28 h-20 md:h-28 bg-[#050505] rounded-[32px] md:rounded-[40px] flex items-center justify-center mb-10 border border-white/5 shadow-inner">
                                    <Smartphone className="w-10 md:w-12 h-10 md:h-12 text-slate-900 italic" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-4 tracking-tighter italic leading-none">No Active Numbers</h3>
                                <p className="text-[9px] md:text-[10px] text-slate-800 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] max-w-sm leading-relaxed italic">
                                    Acquired numbers will appear here automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.02]">
                                {activeOrders.map(order => (
                                    <div key={order.id} className="p-8 md:p-12 hover:bg-white/[0.01] transition-colors space-y-6 md:space-y-8 italic">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                                            <div className="flex items-center gap-6 md:gap-8">
                                                <div className="w-14 md:w-18 h-14 md:w-18 h-14 md:h-18 rounded-2xl md:rounded-[24px] bg-[#050505] flex items-center justify-center text-[#b91c1c] border border-white/5 shadow-inner italic">
                                                    <Smartphone className="w-7 md:w-8 h-7 md:h-8 italic" />
                                                </div>
                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    <div className="flex items-center gap-4 md:gap-6">
                                                        <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic leading-none">+{order.number}</p>
                                                        <button onClick={() => copyToClipboard(order.number)} className="p-2 hover:bg-[#b91c1c]/10 text-slate-800 hover:text-[#b91c1c] rounded-xl transition-all active:scale-95">
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none pt-1">Server: {order.provider} • {order.service}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                                <div className="text-right hidden md:block space-y-1">
                                                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.4em] leading-none italic opacity-60">STATUS</p>
                                                    <p className={`text-[11px] font-black uppercase tracking-[0.1em] mt-1 italic leading-none ${order.status === 'SMS_RECEIVED' ? 'text-emerald-500' : 'text-[#b91c1c]'
                                                        }`}>{order.status}</p>
                                                </div>
                                                <div className="h-10 md:h-12 w-[1px] bg-white/[0.03] mx-2 md:mx-4 hidden md:block"></div>
                                                <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleAction(order.id, "1", order.provider)}
                                                        className="flex-1 md:flex-none h-12 md:h-14 px-4 md:px-8 bg-[#050505] border border-white/5 text-slate-700 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-white hover:border-[#b91c1c]/30 transition-all flex items-center justify-center gap-2 md:gap-3 italic shadow-inner"
                                                    >
                                                        <RefreshCw className="w-3.5 md:w-4 h-3.5 md:h-4 text-[#b91c1c] italic" />
                                                        Refresh
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(order.id, "6", order.provider)}
                                                        className="flex-1 md:flex-none h-12 md:h-14 px-4 md:px-8 bg-[#050505] border border-white/5 text-slate-700 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-rose-500 hover:border-rose-500/30 transition-all flex items-center justify-center gap-2 md:gap-3 italic shadow-inner"
                                                    >
                                                        <XCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-rose-500 italic" />
                                                        Cancel
                                                    </button>
                                                    {order.sms && (
                                                        <button
                                                            onClick={() => handleAction(order.id, "3", order.provider)}
                                                            className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 md:gap-3 italic active:scale-95 shadow-2xl shadow-emerald-950/20"
                                                        >
                                                            <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 italic" />
                                                            Finish
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {order.sms ? (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[28px] md:rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-inner">
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10 italic">
                                                        <CheckCircle2 className="w-6 md:w-7 h-6 md:w-7 italic" />
                                                    </div>
                                                    <div className="space-y-1.5 md:space-y-2">
                                                        <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">OTP RECEIVED</p>
                                                        <p className="text-[14px] md:text-[15px] font-black text-white leading-relaxed italic uppercase tracking-wider">{order.sms}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const code = order.sms.match(/\d{4,8}/)?.[0];
                                                        if (code) copyToClipboard(code);
                                                    }}
                                                    className="w-full md:w-auto h-12 md:h-14 px-8 md:px-10 bg-emerald-600 text-white rounded-xl md:rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-emerald-700 transition-all italic active:scale-95 shadow-2xl shadow-emerald-950/20"
                                                >
                                                    COPY CODE
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-[#050505] border border-white/[0.02] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex items-center justify-center gap-4 md:gap-6 shadow-inner italic">
                                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#b91c1c] animate-pulse"></div>
                                                <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none">Awaiting SMS Transmission...</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Safety Footer */}
            <div className="p-8 md:p-10 bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 shadow-2xl relative overflow-hidden shadow-inner italic">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#b91c1c]"></div>
                <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-14 md:w-16 h-14 md:w-16 h-14 md:h-16 rounded-[20px] md:rounded-[22px] bg-[#050505] flex items-center justify-center text-slate-900 border border-white/5 italic">
                        <Clock className="w-7 md:w-8 h-7 md:h-8 italic" />
                    </div>
                    <div className="space-y-1.5 md:space-y-2 text-center md:text-left">
                        <p className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-tighter italic leading-none">SECURE OTP HUB</p>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none italic">ENCRYPTED SIGNAL SESSIONS</p>
                    </div>
                </div>
                <div className="flex items-center gap-8 md:gap-10 text-slate-900">
                    <ShieldCheck className="w-5 md:w-6 h-5 md:h-6 text-emerald-500 italic" />
                    <div className="h-8 w-[1px] bg-white/[0.03] hidden sm:block"></div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none hidden sm:block">PROTECTED BY SMM12 SECURE</p>
                </div>
            </div>
        </div>
    );
}
