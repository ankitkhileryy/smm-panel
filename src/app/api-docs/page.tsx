"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Shield, Zap, Globe, Key, Activity, Target } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";

export default function ApiDocsPage() {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    const copyKey = () => {
        if (user?.apiKey) {
            navigator.clipboard.writeText(user.apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] py-20 px-8 sm:px-16 lg:px-32 font-sans space-y-24 overflow-x-hidden selection:bg-red-900/30">
            <div className="max-w-7xl mx-auto space-y-24">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10 text-center"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic flex flex-col items-center justify-center gap-6 leading-[0.85]">
                        DEVELOPER <span className="text-[#b91c1c] drop-shadow-[0_0_30px_rgba(185,28,28,0.4)]">INTEGRATIONS</span>
                    </h1>
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#b91c1c] animate-pulse"></div>
                            <p className="text-slate-800 font-black uppercase tracking-[0.6em] text-[10px] italic leading-none">Global_Authority_REST_API_v1.0 • Node_Alpha_Deployment</p>
                        </div>
                        <div className="w-64 h-1.5 bg-[#b91c1c]/20 mx-auto rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-[#b91c1c]"></div>
                        </div>
                    </div>
                </motion.div>

                {/* API Key Section */}
                <div className="p-12 bg-[#0a0a0c] border border-white/[0.03] shadow-2xl rounded-[64px] overflow-hidden relative group animate-reveal shadow-inner">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000"></div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white uppercase italic flex items-center gap-6 leading-none tracking-tighter">
                                <Key className="w-10 h-10 text-[#b91c1c] italic" />
                                NODE <span className="text-[#b91c1c]">ACCESS_KEY</span>
                            </h2>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] italic leading-none">Keep this payload secure. Do not broadcast in public nodes.</p>
                        </div>
                        <div className="flex items-center gap-6 bg-[#050505] p-6 rounded-[32px] w-full lg:w-auto border border-white/5 shadow-inner">
                            <code className="px-8 font-mono text-[13px] text-[#b91c1c] truncate max-w-[250px] md:max-w-none font-black italic uppercase tracking-wider">
                                {user?.apiKey || "AUTHENTICATE_TO_VIEW_CREDENTIALS"}
                            </code>
                            <button
                                onClick={copyKey}
                                className="p-5 bg-[#b91c1c] text-white rounded-[24px] shadow-2xl shadow-red-950/40 hover:bg-[#991b1b] transition-all active:scale-90"
                            >
                                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Docs Content */}
                <div className="grid gap-12 animate-reveal">
                    <ApiSection
                        title="Catalog_Link_Protocol"
                        endpoint="GET /api/v1/services"
                        description="Retrieve a full payload of active services along with real-time pricing magnitude and resource counts."
                        params={[]}
                    />

                    <ApiSection
                        title="Execute_Force_Payload"
                        endpoint="POST /api/v1/orders/add"
                        description="Deploy a new order through the global API pipeline with specific target parameters and magnitude."
                        params={[
                            { name: "service", type: "INT", desc: "PROTOCOL ID (E.G. 104)" },
                            { name: "link", type: "STRING", desc: "TARGET DESTINATION URL" },
                            { name: "quantity", type: "INT", desc: "UNIT MAGNITUDE FOR DEPLOYMENT" },
                            { name: "runs", type: "INT", desc: "DRIP-FEED FREQUENCY (OPTIONAL)" },
                            { name: "interval", type: "INT", desc: "PULSE DELAY IN MINUTES (OPTIONAL)" },
                        ]}
                    />

                    <ApiSection
                        title="Telemetry_Status_Pulse"
                        endpoint="POST /api/v1/orders/status"
                        description="Fetch the current progress, health metrics, and fulfillment status of an existing deployment."
                        params={[
                            { name: "order", type: "INT", desc: "UNIQUE DEPLOYMENT ID" }
                        ]}
                    />
                </div>
            </div>
            {/* Footer */}
            <div className="text-center pt-24 border-t border-white/[0.03] space-y-6">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.8em] italic leading-none opacity-40">DEV_INTERFACE_v4.0_ENCRYPTED</p>
            </div>
        </div>
    );
}

function ApiSection({ title, endpoint, description, params }: any) {
    return (
        <div className="p-14 bg-[#0a0a0c] border border-white/[0.03] shadow-2xl rounded-[64px] space-y-12 relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all duration-1000"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/[0.03] pb-12 relative z-10">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h3>
                <div className="flex items-center gap-4 bg-[#050505] text-[#b91c1c] px-8 py-4 rounded-[28px] font-mono text-xs border border-white/5 shadow-inner">
                    <Terminal className="w-4 h-4 text-[#b91c1c]" />
                    <span className="font-black italic uppercase tracking-widest">{endpoint}</span>
                </div>
            </div>

            <p className="text-[13px] font-black text-slate-800 leading-relaxed uppercase italic tracking-[0.2em] opacity-80 relative z-10">{description}</p>

            {params.length > 0 && (
                <div className="space-y-8 relative z-10">
                    <h4 className="text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.6em] ml-4 italic leading-none">PARAMETER_SCHEMATIC</h4>
                    <div className="overflow-x-auto bg-[#050505] rounded-[40px] border border-white/5 shadow-inner p-4">
                        <table className="w-full text-left italic">
                            <thead>
                                <tr className="border-b border-white/[0.03]">
                                    <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-800 tracking-[0.4em]">VARIABLE</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-800 tracking-[0.4em]">DATATYPE</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-800 tracking-[0.4em]">SPECIFICATION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {params.map((p: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/[0.01] transition-all group/row">
                                        <td className="px-10 py-8 font-mono text-[12px] text-white font-black uppercase tracking-wider group-hover/row:text-[#b91c1c] transition-colors">{p.name}</td>
                                        <td className="px-10 py-8 text-[10px] font-black text-slate-700 uppercase tracking-widest">{p.type}</td>
                                        <td className="px-10 py-8 text-[10px] font-black text-slate-800 uppercase tracking-widest leading-relaxed">{p.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
