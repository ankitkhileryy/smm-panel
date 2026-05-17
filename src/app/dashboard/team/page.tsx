"use client";

import { Users, ShieldCheck, Code, Cpu, Award, Zap, Target, Activity, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function TeamPage() {
    return (
        <div className="w-full space-y-12 md:space-y-16 pb-24 font-sans overflow-x-hidden px-4 md:px-0">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 md:space-y-8 py-8 md:py-12 italic"
            >
                <div className="flex justify-center mb-6 md:mb-8 italic">
                    <div className="px-5 md:px-6 py-2 md:py-2.5 bg-[#b91c1c]/5 rounded-full border border-[#b91c1c]/10 flex items-center gap-3 md:gap-4 italic shadow-2xl">
                        <Award className="w-4 h-4 text-[#b91c1c] italic" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#b91c1c] italic leading-none">THE TEAM BEHIND SMM12</span>
                    </div>
                </div>
                <div className="space-y-3 md:space-y-4 italic leading-none">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                        Our <span className="text-[#b91c1c]">Founders</span>
                    </h1>
                    <p className="text-slate-900 font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[10px] italic leading-none">The architects of your digital growth</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 animate-reveal italic">
                {/* Founder 01 */}
                <div className="bg-[#0a0a0c] border border-white/[0.03] p-8 md:p-16 rounded-[40px] md:rounded-[64px] shadow-2xl relative overflow-hidden group shadow-inner italic">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 italic"></div>

                    <div className="flex flex-col items-center text-center relative z-10 space-y-8 md:space-y-10 italic">
                        <div className="w-32 md:w-40 h-32 md:h-40 rounded-[32px] md:rounded-[40px] bg-[#b91c1c] text-white flex items-center justify-center shadow-2xl shadow-red-950/50 rotate-6 group-hover:rotate-0 transition-all duration-700 italic border-4 border-[#050505]">
                            <span className="text-3xl md:text-4xl font-black italic">AB</span>
                        </div>

                        <div className="space-y-2 md:space-y-3 italic leading-none">
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Founder</h3>
                            <p className="text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.3em] md:tracking-[0.5em] italic mb-1 leading-none">Founder & Lead Engineer</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full italic">
                            <div className="bg-[#050505] p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 shadow-inner group/card hover:border-[#b91c1c]/20 transition-all italic">
                                <Code className="w-6 md:w-8 h-6 md:h-8 text-[#b91c1c] mx-auto mb-4 italic group-hover:scale-110 transition-transform" />
                                <p className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">SYSTEMS</p>
                            </div>
                            <div className="bg-[#050505] p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 shadow-inner group/card hover:border-[#b91c1c]/20 transition-all italic">
                                <ShieldCheck className="w-6 md:w-8 h-6 md:h-8 text-emerald-500 mx-auto mb-4 italic group-hover:scale-110 transition-transform" />
                                <p className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">SECURITY</p>
                            </div>
                        </div>

                        <div className="w-full bg-[#050505] p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 text-left shadow-inner italic">
                            <p className="text-[9px] md:text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 italic leading-none">Role & Vision</p>
                            <p className="text-[10px] md:text-[11px] text-slate-800 font-black leading-relaxed uppercase italic">
                                Specialized in building high-performance web systems and secure payment networks to ensure the most reliable service delivery for our users.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Founder 02 */}
                <div className="bg-[#0a0a0c] border border-white/[0.03] p-8 md:p-16 rounded-[40px] md:rounded-[64px] shadow-2xl relative overflow-hidden group shadow-inner italic">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 italic"></div>

                    <div className="flex flex-col items-center text-center relative z-10 space-y-8 md:space-y-10 italic">
                        <div className="w-32 md:w-40 h-32 md:h-40 rounded-[32px] md:rounded-[40px] bg-[#050505] text-white flex items-center justify-center shadow-2xl shadow-black -rotate-6 group-hover:rotate-0 transition-all duration-700 italic border-4 border-[#b91c1c]/20">
                            <span className="text-3xl md:text-4xl font-black italic text-[#b91c1c]">X</span>
                        </div>

                        <div className="space-y-2 md:space-y-3 italic leading-none">
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Xebix</h3>
                            <p className="text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.3em] md:tracking-[0.5em] italic mb-1 leading-none">Co-Founder & Strategist</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full italic">
                            <div className="bg-[#050505] p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 shadow-inner group/card hover:border-[#b91c1c]/20 transition-all italic">
                                <Cpu className="w-6 md:w-8 h-6 md:h-8 text-[#b91c1c] mx-auto mb-4 italic group-hover:scale-110 transition-transform" />
                                <p className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic leading-none">SMM STRATEGY</p>
                            </div>
                            <div className="bg-[#050505] p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 shadow-inner group/card hover:border-[#b91c1c]/20 transition-all italic">
                                <Users className="w-6 md:w-8 h-6 md:h-8 text-[#b91c1c] mx-auto mb-4 italic group-hover:scale-110 transition-transform" />
                                <p className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic leading-none">PARTNERSHIPS</p>
                            </div>
                        </div>

                        <div className="w-full bg-[#050505] p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 text-left shadow-inner italic">
                            <p className="text-[9px] md:text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 italic leading-none">Role & Vision</p>
                            <p className="text-[10px] md:text-[11px] text-slate-800 font-black leading-relaxed uppercase italic">
                                Focused on driving strategic growth through innovative digital marketing programs and creating the best experience for our community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
