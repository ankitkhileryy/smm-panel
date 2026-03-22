"use client";

import { useState, useEffect } from "react";
import {
    Users, ShoppingBag, TrendingUp, Settings,
    RefreshCcw, Plus, Search, ChevronRight,
    Clock, CheckCircle, AlertCircle, Wallet,
    ShieldAlert, Percent, Mail, BarChart3, PieChart,
    ArrowUpRight, ArrowDownRight, Activity, Megaphone,
    Hammer, PowerOff, UserCog, Palette, ShieldCheck,
    CreditCard, Server, Zap, Target, Shield
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [statusSyncing, setStatusSyncing] = useState(false);
    const [maintenance, setMaintenance] = useState(false);
    const [broadcast, setBroadcast] = useState("");
    const [themeColor, setThemeColor] = useState("#b91c1c");

    // Form States
    const [targetEmail, setTargetEmail] = useState("");
    const [balanceAmount, setBalanceAmount] = useState("");
    const [balanceAction, setBalanceAction] = useState("add"); // "add" or "subtract"

    // Order Management States
    const [adminOrders, setAdminOrders] = useState<any[]>([]);
    const [orderStats, setOrderStats] = useState<any>(null);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const ADMIN_EMAIL = "ankitbishnoi9928154849@gmail.com";

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "admin" || user.email.toLowerCase() !== ADMIN_EMAIL) {
                router.push("/dashboard");
            } else {
                fetchStats();
                fetchSettings();
                fetchAdminOrders();
            }
        }
    }, [user, authLoading]);

    const fetchAdminOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setAdminOrders(data.orders || []);
            setOrderStats(data.stats);
        } catch (e) {
            console.error(e);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            setStats(data.stats);
            setRecentUsers(data.recentUsers);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();

            setMaintenance(data.maintenanceMode || false);
            setBroadcast(data.broadcastMessage || "");
            setThemeColor(data.themeColor || "#b91c1c");
        } catch (e) { console.error(e); }
    };

    const handleUpdateSettings = async (updates: any) => {
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    maintenanceMode: maintenance,
                    broadcastMessage: broadcast,
                    themeColor: themeColor,
                    ...updates
                })
            });
            const data = await res.json();
            alert(data.message);
            fetchSettings();
        } catch (e) { alert("Settings update failed"); }
    };

    const handleStatusSync = async () => {
        setStatusSyncing(true);
        try {
            const res = await fetch("/api/admin/sync-orders", { method: "POST" });
            const data = await res.json();
            alert(`${data.message}\nSynced: ${data.synced}\nRefunds: ${data.refunds}`);
            fetchAdminOrders();
        } catch (e) { alert("Status sync failed"); }
        setStatusSyncing(false);
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch("/api/admin/sync-services", { method: "POST" });
            const data = await res.json();
            alert(data.message);
        } catch (e) { alert("Sync failed"); }
        setSyncing(false);
    };

    const handleUpdateBalance = async () => {
        if (!targetEmail || !balanceAmount) return;
        try {
            const res = await fetch("/api/admin/stats", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: targetEmail, amount: balanceAmount, action: balanceAction })
            });
            const data = await res.json();
            alert(data.message);
            fetchStats();
        } catch (e) { alert("Failed to update balance"); }
    };

    if (loading || authLoading) return (
        <div className="flex flex-col items-center justify-center py-64 gap-10">
            <div className="w-12 h-12 border border-[#b91c1c]/20 border-t-[#b91c1c] rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.6em] animate-pulse leading-none italic">Initializing Admin Console...</p>
        </div>
    );

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="w-full space-y-12 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/[0.03] italic"
            >
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Admin <span className="text-[#b91c1c]">Dashboard</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse shadow-[0_0_10px_rgba(185,28,28,0.3)] italic"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">
                            Global Administration Control Center
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                    <button
                        onClick={handleStatusSync}
                        disabled={statusSyncing}
                        className="h-14 w-full sm:w-auto px-8 bg-[#0a0a0c] border border-white/5 text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:text-white hover:border-[#b91c1c]/20 transition-all shadow-inner italic"
                    >
                        <Clock className={`w-4 h-4 text-[#b91c1c] italic ${statusSyncing ? 'animate-spin' : ''}`} />
                        Sync Orders
                    </button>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="h-14 w-full sm:w-auto px-10 bg-[#b91c1c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#991b1b] transition-all shadow-2xl shadow-red-950/40 disabled:opacity-50 italic active:scale-95"
                    >
                        <RefreshCcw className={`w-4 h-4 italic ${syncing ? 'animate-spin' : ''}`} />
                        Sync Services
                    </button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 animate-reveal italic"
            >
                <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${stats?.revenue?.toLocaleString() || '0'}`} trend="+12.5%" color="red" />
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || '0'} trend="+4 today" color="red" />
                <StatCard icon={Activity} label="Commission" value={`₹${stats?.commissions?.toFixed(2) || '0'}`} trend="Active" color="emerald" />
                <StatCard icon={ShoppingBag} label="Order Count" value={stats?.orders?.total || '0'} trend="Live" color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 italic">
                {/* Analytics & Orders */}
                <div className="lg:col-span-2 space-y-10 md:space-y-12 animate-reveal italic">
                    {/* Charts Panel */}
                    <div 
                        className="bg-[#0a0a0c] border border-white/[0.03] rounded-[48px] md:rounded-[64px] p-8 md:p-16 shadow-2xl overflow-hidden relative group shadow-inner italic"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 italic"></div>

                        <div className="flex items-center justify-between mb-12 md:mb-16 relative z-10 italic">
                            <div className="space-y-3 italic">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6 italic">
                                    <BarChart3 className="w-8 h-8 text-[#b91c1c] italic" />
                                    Growth <span className="text-[#b91c1c]">Analytics</span>
                                </h2>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none">Global Performance Metrics</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 relative z-10 italic">
                            <div className="space-y-10 md:space-y-12 italic">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] ml-2 italic leading-none">Category Performance</h3>
                                <div className="space-y-8 md:space-y-10 italic">
                                    {(stats?.platformPerformance || []).slice(0, 5).map((p: any, i: number) => (
                                        <div key={i} className="space-y-4 italic">
                                            <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] italic">
                                                <span className="text-slate-700 truncate max-w-[150px] md:max-w-[200px] italic">{p.category}</span>
                                                <span className="text-[#b91c1c] tracking-tighter italic">₹{p.revenue.toFixed(0)}</span>
                                            </div>
                                            <div className="h-2 bg-[#050505] rounded-full overflow-hidden border border-white/5 shadow-inner italic">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (p.revenue / (stats?.revenue || 1)) * 100)}%` }}
                                                    transition={{ duration: 1.5, delay: 0.1 + i * 0.1, ease: "circOut" }}
                                                    className="h-full bg-[#b91c1c] rounded-full shadow-[0_0_15px_rgba(185,28,28,0.2)] italic"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#050505] border border-white/[0.02] rounded-[38px] md:rounded-[48px] p-8 md:p-12 flex flex-col justify-between shadow-2xl italic">
                                <div className="space-y-8 md:space-y-10 italic">
                                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none">Revenue Trend</h3>
                                    <div className="flex items-end gap-3 md:gap-5 h-40 pt-10 italic">
                                        {(stats?.monthlyRevenue || []).map((m: any, i: number) => (
                                            <div key={i} className="flex-1 group relative h-full flex flex-col justify-end italic">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max(15, (m.total / (stats?.revenue || 1)) * 100)}%` }}
                                                    transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "circOut" }}
                                                    className="w-full bg-[#b91c1c]/10 border border-[#b91c1c]/20 rounded-t-xl md:rounded-t-2xl transition-all group-hover:bg-[#b91c1c] group-hover:shadow-[0_0_30px_rgba(185,28,28,0.2)] italic"
                                                />
                                                <div className="mt-6 md:mt-8 text-[8px] md:text-[9px] font-black text-center text-slate-900 uppercase tracking-tighter group-hover:text-white transition-colors italic leading-none">
                                                    {months[m.month - 1]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-10 md:mt-14 pt-10 md:pt-14 border-t border-white/[0.03] italic">
                                    <div className="flex items-center justify-between italic">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Projected Growth</p>
                                        <p className="text-2xl md:text-3xl font-black text-emerald-500 tracking-tighter leading-none italic">+₹{((stats?.revenue || 0) * 0.45).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Logs */}
                    <div 
                        className="bg-[#0a0a0c] border border-white/[0.03] rounded-[48px] md:rounded-[64px] shadow-2xl overflow-hidden group shadow-inner italic"
                    >
                        <div className="p-8 md:p-16 border-b border-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10 italic">
                            <div className="space-y-3 md:space-y-4 italic">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6 italic">
                                    <ShoppingBag className="w-8 h-8 text-[#b91c1c] italic" />
                                    Order <span className="text-[#b91c1c]">Logs</span>
                                </h2>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] italic leading-none">Global Transaction History</p>
                            </div>
                            <div className="flex flex-wrap gap-3 md:gap-5 italic">
                                <div className="px-6 md:px-8 py-2 md:py-3 bg-[#050505] text-slate-800 rounded-[18px] md:rounded-[20px] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-white/[0.03] shadow-inner italic leading-none">
                                    {orderStats?.total || 0} TOTAL
                                </div>
                                <div className="px-6 md:px-8 py-2 md:py-3 bg-emerald-500/5 text-emerald-500 rounded-[18px] md:rounded-[20px] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-emerald-500/10 shadow-inner italic leading-none">
                                    {orderStats?.completed || 0} DONE
                                </div>
                                <div className="px-6 md:px-8 py-2 md:py-3 bg-[#b91c1c]/5 text-[#b91c1c] rounded-[18px] md:rounded-[20px] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-[#b91c1c]/10 shadow-inner italic leading-none">
                                    {orderStats?.pending || 0} PENDING
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar-red italic">
                            <table className="w-full text-left border-collapse italic">
                                <thead className="bg-[#050505]/60 border-b border-white/[0.03] italic">
                                    <tr className="italic">
                                        <th className="px-8 md:px-12 py-6 md:py-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">Order ID</th>
                                        <th className="px-8 md:px-12 py-6 md:py-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">User</th>
                                        <th className="px-8 md:px-12 py-6 md:py-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">Status</th>
                                        <th className="px-8 md:px-12 py-6 md:py-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] text-right italic leading-none">Price</th>
                                        <th className="px-8 md:px-12 py-6 md:py-10 text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] text-right italic leading-none">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02] italic">
                                    {adminOrders.map((o) => (
                                        <tr key={o._id} className="hover:bg-white/[0.01] transition-colors group italic">
                                            <td className="px-8 md:px-12 py-6 md:py-10 italic">
                                                <div className="flex flex-col gap-1.5 md:gap-2 italic">
                                                    <span className="text-[13px] md:text-[14px] font-black text-white uppercase tracking-tighter italic group-hover:text-[#b91c1c] transition-colors leading-none italic">#{o.provider_order_id || o._id.slice(-8).toUpperCase()}</span>
                                                    <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase truncate max-w-[120px] md:max-w-[150px] tracking-widest leading-none italic">{o.link}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 md:px-12 py-6 md:py-10 italic">
                                                <div className="flex flex-col gap-1.5 md:gap-2 italic">
                                                    <span className="text-[12px] md:text-[13px] font-black text-slate-700 uppercase tracking-tighter italic leading-none italic">{(o.user_id as any)?.email?.split('@')[0] || 'Unknown'}</span>
                                                    <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.1em] leading-none italic">{(o.user_id as any)?.email || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 md:px-12 py-6 md:py-10 italic">
                                                <StatusBadge status={o.status} />
                                            </td>
                                            <td className="px-8 md:px-12 py-6 md:py-10 text-right italic">
                                                <span className="text-[16px] md:text-[18px] font-black text-white tracking-tighter italic leading-none italic">₹{o.charge.toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 md:px-12 py-6 md:py-10 text-right text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic leading-none opacity-40 italic">
                                                {new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Operations Side Panel */}
                <div className="space-y-10 md:space-y-12 animate-reveal italic">
                    {/* Credit Injector */}
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-2xl relative overflow-hidden group shadow-inner italic">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#b91c1c] italic"></div>
                        <h2 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-12 flex items-center gap-6 italic">
                            <Wallet className="w-5 md:w-6 h-5 md:h-6 text-[#b91c1c] italic" />
                            Balance Manager
                        </h2>

                        <div className="space-y-8 md:space-y-10 italic">
                            <div className="flex bg-[#050505] p-2 rounded-[24px] md:rounded-[28px] border border-white/5 shadow-inner italic">
                                <button
                                    onClick={() => setBalanceAction("add")}
                                    className={`flex-1 py-3 md:py-4 rounded-[18px] md:rounded-[20px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all italic ${balanceAction === "add" ? 'bg-[#b91c1c] text-white shadow-2xl shadow-red-950/40' : 'text-slate-900 hover:text-white'}`}
                                >
                                    ADD
                                </button>
                                <button
                                    onClick={() => setBalanceAction("subtract")}
                                    className={`flex-1 py-3 md:py-4 rounded-[18px] md:rounded-[20px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all italic ${balanceAction === "subtract" ? 'bg-red-950 text-white shadow-2xl shadow-red-950/40' : 'text-slate-900 hover:text-white'}`}
                                >
                                    SUBTRACT
                                </button>
                            </div>

                            <div className="space-y-3 md:space-y-4 italic">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] ml-2 leading-none italic">Target User Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter user email..."
                                    value={targetEmail}
                                    onChange={(e) => setTargetEmail(e.target.value)}
                                    className="w-full h-16 md:h-18 bg-[#050505] border border-white/5 rounded-2xl px-6 md:px-8 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner placeholder:text-slate-950 italic tracking-wider italic"
                                />
                            </div>

                            <div className="space-y-3 md:space-y-4 italic">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] ml-2 leading-none italic">Amount (₹)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={balanceAmount}
                                    onChange={(e) => setBalanceAmount(e.target.value)}
                                    className="w-full h-16 md:h-18 bg-[#050505] border border-white/5 rounded-2xl px-6 md:px-8 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner placeholder:text-slate-950 italic tracking-widest italic"
                                />
                            </div>

                            <button
                                onClick={handleUpdateBalance}
                                className={`w-full h-18 md:h-22 rounded-[28px] md:rounded-[32px] font-black text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all shadow-2xl active:scale-95 italic ${balanceAction === 'add' ? 'bg-[#b91c1c] text-white shadow-red-950/40' : 'bg-red-950 text-white shadow-red-950/40'}`}
                            >
                                {balanceAction === 'add' ? 'Update Balance' : 'Deduct Balance'}
                            </button>
                        </div>
                    </div>

                    {/* Broadcast Terminal */}
                    <div className="bg-[#b91c1c] rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-2xl shadow-red-950/40 relative overflow-hidden group italic">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -mr-24 -mt-24 italic"></div>
                        <h2 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-12 flex items-center gap-6 relative z-10 italic">
                            <Megaphone className="w-5 md:w-6 h-5 md:h-6 text-white italic" />
                            Broadcast Message
                        </h2>

                        <div className="space-y-8 md:space-y-10 relative z-10 italic">
                            <textarea
                                value={broadcast}
                                onChange={(e) => setBroadcast(e.target.value)}
                                placeholder="Send a message to all users..."
                                className="w-full h-40 md:h-44 bg-black/20 border border-white/10 rounded-[30px] md:rounded-[40px] p-8 md:p-10 text-[12px] md:text-[13px] font-black text-white placeholder:text-white/30 outline-none focus:bg-black/30 resize-none shadow-inner uppercase tracking-wider leading-relaxed italic"
                            />
                            <button
                                onClick={() => handleUpdateSettings({ broadcastMessage: broadcast })}
                                className="w-full h-18 md:h-20 bg-[#050505] text-[#b91c1c] rounded-[24px] md:rounded-3xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-black transition-all shadow-2xl active:scale-95 italic"
                            >
                                Dispatch Notification
                            </button>
                        </div>
                    </div>

                    {/* Lockdown Protocol */}
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[48px] p-8 md:p-12 space-y-8 md:space-y-12 shadow-inner italic">
                        <div className="flex items-center justify-between italic">
                            <div className="space-y-2 md:space-y-3 italic">
                                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] md:tracking-[0.5em] flex items-center gap-6 italic leading-none">
                                    <ShieldAlert className="w-5 h-5 text-red-600 italic" />
                                    Maintenance Mode
                                </h2>
                                <p className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.5em] md:tracking-[0.6em] leading-none italic">Shut down the platform</p>
                            </div>
                            <button
                                onClick={() => {
                                    const next = !maintenance;
                                    setMaintenance(next);
                                    handleUpdateSettings({ maintenanceMode: next });
                                }}
                                className={`w-16 md:w-18 h-8 md:h-10 rounded-full relative transition-all duration-700 shadow-2xl italic ${maintenance ? 'bg-red-700' : 'bg-[#050505] border border-white/5'}`}
                            >
                                <motion.div 
                                    animate={{ left: maintenance ? 'calc(100% - 36px)' : '4px' }}
                                    className={`absolute top-1 w-6 md:w-8 h-6 md:h-8 bg-white rounded-full shadow-lg italic`} 
                                />
                            </button>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="space-y-4 md:space-y-8 px-4 md:px-8 italic">
                        <HealthRow label="Database Status" status="Synchronized" color="emerald" pulse />
                        <HealthRow label="API Status" status="Active" color="rose" />
                        <HealthRow label="Node Status" status="Secure" color="rose" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
    return (
        <div className="bg-[#0a0a0c] border border-white/5 rounded-[40px] md:rounded-[56px] p-8 md:p-12 flex flex-col gap-8 md:gap-12 shadow-2xl hover:border-[#b91c1c]/20 transition-all group relative overflow-hidden shadow-inner italic">
            <div className={`w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-[28px] flex items-center justify-center shrink-0 shadow-2xl border border-white/5 italic ${color === 'red' ? 'bg-[#b91c1c]/5 text-[#b91c1c]' : 'bg-emerald-500/5 text-emerald-500'
                }`}>
                <Icon className="w-8 md:w-10 h-8 md:h-10 group-hover:scale-110 transition-transform duration-1000 italic" />
            </div>
            <div className="space-y-3 md:space-y-5 italic">
                <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">{label}</p>
                <div className="flex items-baseline gap-4 md:gap-5 italic">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none italic">{value}</h3>
                    <span className={`text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1.5 md:py-2 rounded-xl border italic leading-none ${trend.includes('+') ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-[#050505] text-slate-800 border-white/5'
                        } tracking-[0.2em] md:tracking-[0.3em]`}>
                        {trend}
                    </span>
                </div>
            </div>
        </div>
    );
}

function HealthRow({ label, status, color, pulse }: any) {
    return (
        <div className="flex items-center justify-between py-4 md:py-6 border-b border-white/[0.03] last:border-0 hover:translate-x-2 transition-transform italic">
            <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.5em] leading-none italic">{label}</span>
            <div className="flex items-center gap-4 md:gap-6 italic">
                <div className={`w-2 h-2 rounded-full italic ${color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#b91c1c] shadow-[0_0_15px_rgba(185,28,28,0.3)]'} ${pulse ? 'animate-pulse' : ''}`} />
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic leading-none ${color === 'emerald' ? 'text-emerald-500' : 'text-[#b91c1c]'}`}>{status}</span>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        Completed: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.05)]",
        Canceled: "bg-red-500/5 text-red-500 border-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.05)]",
        Refunded: "bg-orange-600/5 text-orange-600 border-orange-600/10 shadow-[0_0_25px_rgba(249,115,22,0.05)]",
        Pending: "bg-[#b91c1c]/5 text-[#b91c1c] border-[#b91c1c]/10 shadow-[0_0_25px_rgba(185,28,28,0.05)]",
        Processing: "bg-blue-600/5 text-blue-600 border-blue-600/10 shadow-[0_0_25px_rgba(37,99,235,0.05)]"
    };

    const currentStyle = styles[status] || styles.Pending;

    return (
        <span className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border italic leading-none ${currentStyle}`}>
            {status}
        </span>
    );
}
