"use client";

import { useState, useEffect } from "react";
import {
    Users, ShoppingBag, TrendingUp, Settings,
    RefreshCcw, Plus, Search, ChevronRight,
    Clock, CheckCircle, AlertCircle, Wallet,
    ShieldAlert, Percent, Mail, BarChart3, PieChart,
    ArrowUpRight, ArrowDownRight, Activity, Megaphone,
    Hammer, PowerOff, UserCog, Palette, ShieldCheck,
    CreditCard, Server, Zap, Target, Shield, Send, Headset, X,
    User as UserIcon
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
    const [themeColor, setThemeColor] = useState("#2563eb");
    const [ppMerchantId, setPpMerchantId] = useState("");
    const [ppSaltKey, setPpSaltKey] = useState("");
    const [ppSaltIndex, setPpSaltIndex] = useState("1");

    // Form States
    const [targetEmail, setTargetEmail] = useState("");
    const [balanceAmount, setBalanceAmount] = useState("");
    const [balanceAction, setBalanceAction] = useState("add"); // "add" or "subtract"

    // Order Management States
    const [adminOrders, setAdminOrders] = useState<any[]>([]);
    const [orderStats, setOrderStats] = useState<any>(null);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Support Tickets Management
    const [adminTickets, setAdminTickets] = useState<any[]>([]);
    const [ticketReply, setTicketReply] = useState("");
    const [activeTicket, setActiveTicket] = useState<any>(null);

    // All Users management
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [editingUser, setEditingUser] = useState<any>(null); // For modal
    const [newUserForm, setNewUserForm] = useState(false);
    const [userFormData, setUserFormData] = useState({ email: "", password: "", balance: "0", role: "user" });

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "admin") {
                router.push("/dashboard");
            } else {
                fetchStats();
                fetchSettings();
                fetchAdminOrders();
                fetchAdminTickets();
                fetchAllUsers();
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
            setThemeColor(data.themeColor || "#2563eb");
            setPpMerchantId(data.phonepeMerchantId || "");
            setPpSaltKey(data.phonepeSaltKey || "");
            setPpSaltIndex(data.phonepeSaltIndex || "1");
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
            fetchAllUsers();
        } catch (e) { alert("Failed to update balance"); }
    };

    const fetchAdminTickets = async () => {
        try {
            const res = await fetch("/api/admin/tickets");
            const data = await res.json();
            setAdminTickets(data);
        } catch (e) { console.error(e); }
    };

    const handleTicketReply = async (id: string, message: string, status?: string) => {
        if (!message && !status) return;
        try {
            const res = await fetch(`/api/admin/tickets/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, status })
            });
            if (res.ok) {
                setTicketReply("");
                setActiveTicket(null);
                fetchAdminTickets();
            }
        } catch (e) { alert("Ticket reply failed"); }
    };

    const fetchAllUsers = async (query = "") => {
        try {
            const res = await fetch(`/api/admin/users?query=${query}`);
            const data = await res.json();
            setAllUsers(data);
        } catch (e) { console.error(e); }
    };

    const handleUserSave = async () => {
        try {
            const isNew = !editingUser?._id;
            const res = await fetch(isNew ? "/api/admin/users" : "/api/admin/users", {
                method: isNew ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: editingUser?._id,
                    email: userFormData.email,
                    password: userFormData.password,
                    balance: parseFloat(userFormData.balance),
                    role: userFormData.role
                })
            });
            const data = await res.json();
            alert(data.message);
            if (res.ok) {
                setEditingUser(null);
                setNewUserForm(false);
                fetchAllUsers(userSearch);
            }
        } catch (e) { alert("Operation failed"); }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("🚨 PURGE NODE? This will destroy all user data irreversibly.")) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.message);
            fetchAllUsers(userSearch);
        } catch (e) { alert("Purge failed"); }
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

                        {/* PhonePe Parameters */}
                        <div className="pt-8 border-t border-white/5 mt-8 bg-black/20 p-8 rounded-[32px] space-y-8 italic shadow-inner">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-4 italic">
                                <CreditCard className="w-4 h-4 text-[#b91c1c] italic" />
                                PhonePe Merchant Params
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 italic">
                                <div className="space-y-3 italic">
                                    <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest ml-1 italic">Merchant ID</label>
                                    <input
                                        type="text"
                                        placeholder="PGM..."
                                        value={ppMerchantId}
                                        onChange={(e) => setPpMerchantId(e.target.value)}
                                        className="w-full h-14 bg-[#050505] border border-white/5 rounded-xl px-6 text-xs font-black text-white outline-none focus:border-[#b91c1c]/30 italic shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3 italic">
                                    <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest ml-1 italic">Salt Key</label>
                                    <input
                                        type="text"
                                        placeholder="0-9a-f..."
                                        value={ppSaltKey}
                                        onChange={(e) => setPpSaltKey(e.target.value)}
                                        className="w-full h-14 bg-[#050505] border border-white/5 rounded-xl px-6 text-xs font-black text-white outline-none focus:border-[#b91c1c]/30 italic shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3 italic">
                                    <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest ml-1 italic">Salt Index</label>
                                    <input
                                        type="text"
                                        value={ppSaltIndex}
                                        onChange={(e) => setPpSaltIndex(e.target.value)}
                                        className="w-full h-14 bg-[#050505] border border-white/5 rounded-xl px-6 text-xs font-black text-white outline-none focus:border-[#b91c1c]/30 italic text-center shadow-inner"
                                    />
                                </div>
                                <div className="flex items-end italic">
                                    <button 
                                        onClick={() => handleUpdateSettings({ 
                                            phonepeMerchantId: ppMerchantId, 
                                            phonepeSaltKey: ppSaltKey, 
                                            phonepeSaltIndex: ppSaltIndex 
                                        })} 
                                        className="w-full h-14 bg-[#b91c1c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all active:scale-95 italic"
                                    >
                                        UPDATE GATEWAY
                                    </button>
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
                    {/* User Directory Management */}
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-inner group italic">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                            <div className="space-y-2">
                                <h2 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.4em] md:tracking-[0.5em] flex items-center gap-6 italic leading-none">
                                    <Users className="w-5 md:w-6 h-5 md:h-6 text-[#b91c1c] italic" />
                                    User Directory
                                </h2>
                                <button 
                                    onClick={() => {
                                        setEditingUser({}); // Signal new user
                                        setUserFormData({ email: "", password: "", balance: "0", role: "user" });
                                        setNewUserForm(true);
                                    }}
                                    className="text-[9px] font-black text-[#b91c1c] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-3 h-3" /> Add New Node
                                </button>
                            </div>
                            <div className="flex items-center gap-4 bg-[#050505] p-2 md:p-3 rounded-[24px] border border-white/5 w-full md:w-auto shadow-inner italic">
                                <Search className="w-4 h-4 text-slate-900 ml-4 italic" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value);
                                        fetchAllUsers(e.target.value);
                                    }}
                                    className="bg-transparent border-none outline-none text-[12px] font-black text-white uppercase px-4 w-full md:w-48 placeholder-slate-950 italic tracking-wider shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar-red italic">
                            {(allUsers.length > 0 ? allUsers : recentUsers).map((u, i) => (
                                <div key={i} className="flex flex-col gap-4 p-6 md:p-8 bg-white/[0.01] rounded-[32px] border border-white/[0.03] hover:bg-white/[0.02] transition-colors italic shadow-inner group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6 italic">
                                            <div className="w-12 md:w-14 h-12 md:h-14 bg-[#0a0a0c] rounded-2xl flex items-center justify-center border border-white/[0.03] italic">
                                                <UserIcon className="w-6 h-6 text-slate-800 italic" />
                                            </div>
                                            <div className="space-y-1.5 md:space-y-2 italic text-left">
                                                <h4 className="text-[12px] font-black text-white leading-none italic truncate max-w-[120px]">{u.email}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10 italic leading-none">₹{u.balance.toFixed(2)}</span>
                                                    <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest leading-none">{u.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => {
                                                    setEditingUser(u);
                                                    setUserFormData({ email: u.email, password: "", balance: u.balance.toString(), role: u.role });
                                                    setNewUserForm(true);
                                                }}
                                                className="w-10 h-10 bg-[#050505] text-slate-800 hover:bg-white hover:text-black rounded-xl flex justify-center items-center transition-all border border-white/5 active:scale-95">
                                                <UserCog className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="w-10 h-10 bg-[#050505] text-slate-900 hover:bg-red-600 hover:text-white rounded-xl flex justify-center items-center transition-all border border-white/5 active:scale-95">
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setTargetEmail(u.email);
                                                    window.scrollTo({ top: 1200, behavior: 'smooth' });
                                                }}
                                                className="h-10 px-4 bg-[#b91c1c] text-white rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all">LOAD</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                    SUB
                                </button>
                            </div>

                            <div className="space-y-4 italic">
                                <input
                                    type="email"
                                    placeholder="Enter user email..."
                                    value={targetEmail}
                                    onChange={(e) => setTargetEmail(e.target.value)}
                                    className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner placeholder:text-slate-950 italic"
                                />
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={balanceAmount}
                                    onChange={(e) => setBalanceAmount(e.target.value)}
                                    className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all shadow-inner placeholder:text-slate-950 italic tracking-widest"
                                />
                            </div>

                            <button
                                onClick={handleUpdateBalance}
                                className={`w-full h-16 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all shadow-2xl active:scale-95 italic ${balanceAction === 'add' ? 'bg-[#b91c1c] text-white' : 'bg-red-950 text-white'}`}
                            >
                                {balanceAction === 'add' ? 'Update Balance' : 'Deduct Balance'}
                            </button>
                        </div>
                    </div>

                    {/* Ticket Management Center */}
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-inner italic">
                        <div className="flex items-center justify-between mb-8 md:mb-12">
                            <h2 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.4em] md:tracking-[0.5em] flex items-center gap-6 italic leading-none">
                                <Headset className="w-5 md:w-6 h-5 md:h-6 text-[#b91c1c] italic" />
                                Support Hub
                            </h2>
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">{adminTickets.filter(t => t.status === 'Open').length} OPEN</span>
                        </div>

                        <div className="space-y-6 md:space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar-red italic">
                            {adminTickets.map((t, idx) => (
                                <div key={idx} className="bg-[#050505] p-6 md:p-8 rounded-[32px] border border-white/[0.03] space-y-6 md:space-y-8 italic shadow-inner">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6 italic text-left">
                                            <div className="space-y-1.5 md:space-y-2 italic">
                                                <h4 className="text-sm font-black text-white uppercase italic leading-none truncate max-w-[150px]">{t.subject}</h4>
                                                <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest italic leading-none">{t.user_id?.email || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 italic h-fit">
                                            <button onClick={() => setActiveTicket(activeTicket === t._id ? null : t._id)} className="px-5 py-2.5 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#b91c1c] hover:text-white transition-all italic">OPEN</button>
                                        </div>
                                    </div>

                                    {activeTicket === t._id && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-white/[0.03] italic">
                                            <div className="space-y-4 max-h-[250px] overflow-y-auto px-4 italic">
                                                {t.messages.map((m: any, mIdx: number) => (
                                                    <div key={mIdx} className={`text-[11px] font-bold p-4 rounded-2xl italic leading-relaxed ${m.sender === 'Admin' ? 'bg-[#b91c1c]/10 text-white italic' : 'bg-black/40 text-slate-800 italic'}`}>
                                                        <span className="block text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">{m.sender}</span>
                                                        {m.message}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 italic">
                                                <input
                                                    type="text"
                                                    placeholder="Reply..."
                                                    value={ticketReply}
                                                    onChange={(e) => setTicketReply(e.target.value)}
                                                    className="flex-1 h-12 bg-black/40 border border-white/5 rounded-xl px-6 text-[11px] font-black text-white outline-none focus:border-[#b91c1c]/30 italic uppercase shadow-inner"
                                                />
                                                <button 
                                                    onClick={() => handleTicketReply(t._id, ticketReply)}
                                                    className="w-12 h-12 bg-[#b91c1c] text-white rounded-xl flex items-center justify-center hover:bg-[#991b1b] transition-all italic"
                                                >
                                                    <Send className="w-4 h-4 italic" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lockdown Protocol */}
                    <div className="bg-[#0a0a0c] border border-white/[0.03] rounded-[32px] md:rounded-[48px] p-8 md:p-12 space-y-8 md:space-y-12 shadow-inner italic">
                        <div className="flex items-center justify-between italic">
                            <div className="space-y-2 md:space-y-3 italic">
                                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] md:tracking-[0.5em] flex items-center gap-6 italic leading-none">
                                    <ShieldAlert className="w-5 h-5 text-red-600 italic" />
                                    Maintenance
                                </h2>
                                <p className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none italic opacity-30">Shut down platform</p>
                            </div>
                            <button
                                onClick={() => {
                                    const next = !maintenance;
                                    setMaintenance(next);
                                    handleUpdateSettings({ maintenanceMode: next });
                                }}
                                className={`w-16 h-8 rounded-full relative transition-all duration-700 shadow-2xl italic ${maintenance ? 'bg-red-700' : 'bg-[#050505] border border-white/5'}`}
                            >
                                <motion.div 
                                    animate={{ left: maintenance ? 'calc(100% - 36px)' : '4px' }}
                                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg italic`} 
                                />
                            </button>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="space-y-6 md:space-y-8 px-4 md:px-8 italic">
                        <HealthRow label="DB Nodes" status="Live" color="emerald" pulse />
                        <HealthRow label="API Hermes" status="Active" color="rose" />
                        <HealthRow label="Encrypted" status="Secure" color="rose" />
                    </div>
                </div>
            </div>

            {/* Edit/Add User Modal */}
            <AnimatePresence>
                {newUserForm && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto italic">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a0a0c] w-full max-w-2xl rounded-[40px] md:rounded-[64px] shadow-2xl border border-white/[0.03] overflow-hidden relative shadow-inner italic"
                        >
                            <div className="p-8 md:p-12 border-b border-white/[0.03] flex items-center justify-between italic">
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{editingUser?._id ? "Edit" : "Add"} <span className="text-[#b91c1c]">Network Node</span></h2>
                                <button onClick={() => setNewUserForm(false)} className="w-12 h-12 bg-[#050505] text-slate-800 rounded-xl flex items-center justify-center hover:bg-[#b91c1c] hover:text-white transition-all italic">
                                    <X className="w-6 h-6 italic" />
                                </button>
                            </div>
                            <div className="p-8 md:p-12 space-y-8 italic text-left">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2 italic leading-none">Access Email</label>
                                    <input
                                        type="email"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                        className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all italic shadow-inner"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2 italic leading-none">{editingUser?._id ? "Reset Password (Leave blank to keep)" : "Password"}</label>
                                    <input
                                        type="password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                        className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all italic shadow-inner"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2 italic leading-none">Node Balance</label>
                                        <input
                                            type="number"
                                            value={userFormData.balance}
                                            onChange={(e) => setUserFormData({ ...userFormData, balance: e.target.value })}
                                            className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 transition-all italic shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2 italic leading-none">Security Level</label>
                                        <select
                                            value={userFormData.role}
                                            onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                                            className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[12px] font-black text-white outline-none focus:border-[#b91c1c]/30 uppercase italic"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUserSave}
                                    className="w-full h-20 bg-[#b91c1c] text-white rounded-[26px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all italic active:scale-95"
                                >
                                    AUTHORIZE CHANGES
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
        Completed: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10",
        Canceled: "bg-red-500/5 text-red-500 border-red-500/10",
        Refunded: "bg-orange-600/5 text-orange-600 border-orange-600/10",
        Pending: "bg-[#b91c1c]/5 text-[#b91c1c] border-[#b91c1c]/10",
        Processing: "bg-blue-600/5 text-blue-600 border-blue-600/10"
    };

    const currentStyle = styles[status] || styles.Pending;

    return (
        <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border italic leading-none ${currentStyle}`}>
            {status}
        </span>
    );
}
