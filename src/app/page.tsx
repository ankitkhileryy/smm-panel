"use client";

import Link from "next/link";
import {
  Users,
  Zap,
  ShieldCheck,
  TrendingUp,
  Globe,
  Star,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Wallet,
  CreditCard,
  Target,
  Activity,
  Shield
} from "lucide-react";
import HomeLoginForm from "@/components/home-login-form";
import SplashScreen from "@/components/SplashScreen";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] font-sans selection:bg-red-900/30 overflow-x-hidden text-slate-400 italic">
      <SplashScreen />
      
      {/* Background large decorative letters */}
      <div className="absolute top-0 w-full h-screen pointer-events-none overflow-hidden flex justify-center items-center z-0 opacity-[0.03] pt-20 italic">
        <h1 className="text-[35vw] md:text-[45vw] font-black text-white whitespace-nowrap tracking-tighter select-none uppercase italic leading-none">SMM</h1>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative pb-16 md:pb-32 z-10 italic">
        {/* Header */}
        <header className="w-full z-[100] bg-transparent absolute top-0 left-0 italic">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between h-24 md:h-32 px-6 md:px-16 italic">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 md:gap-6 italic"
            >
              <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl md:rounded-[18px] overflow-hidden bg-[#050505] border border-white/5 flex items-center justify-center shadow-2xl text-[#b91c1c] italic">
                <Shield className="w-6 md:w-7 h-6 md:h-7 italic" />
              </div>
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic leading-none italic">SMM<span className="text-[#b91c1c] italic">12</span></span>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 md:gap-10 italic"
            >
                <Link
                  href="/signup"
                  className="h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-[22px] bg-[#b91c1c] text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-[#991b1b] shadow-2xl shadow-red-900/30 transition-all flex items-center justify-center italic active:scale-95 leading-none"
                >
                  Join Now
                </Link>
            </motion.div>
          </div>
        </header>

        {/* Hero Content */}
        <section className="relative pt-40 md:pt-64 pb-16 md:pb-32 px-6 md:px-16 italic">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 md:gap-24 items-center justify-between italic">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start text-white relative z-10 flex-1 w-full max-w-3xl italic"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 italic">
                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#b91c1c] animate-pulse italic"></div>
                <span className="text-[9px] md:text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.4em] md:tracking-[0.6em] leading-none italic">The World&apos;s #1 SMM Platform</span>
              </div>

              <h1 className="text-5xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.85] mb-8 md:mb-12 text-white uppercase italic transition-all">
                <span className="text-[#b91c1c] drop-shadow-[0_0_30px_rgba(185,28,28,0.4)] italic">Scale</span> Your <br /> Digital <br /> Authority.
              </h1>

              <p className="text-lg md:text-2xl text-slate-900 max-w-2xl mb-12 md:mb-16 font-black uppercase tracking-tight leading-relaxed italic opacity-80 transition-all">
                Empowering brands with high-performance social growth. Get real results and elite engagement with the most reliable SMM platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 w-full sm:w-auto italic">
                <Link href="/signup" className="w-full sm:w-auto h-20 md:h-24 px-12 md:px-16 rounded-[28px] md:rounded-[32px] bg-[#b91c1c] text-white flex items-center justify-center gap-4 md:gap-6 font-black text-[13px] md:text-[15px] uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-[#991b1b] shadow-2xl shadow-red-950/40 transition-all italic active:scale-95 leading-none">
                  Get Started
                  <ArrowRight className="w-5 md:w-6 h-5 md:h-6 italic leading-none" />
                </Link>

                <div className="flex items-center gap-6 md:gap-8 italic">
                  <div className="flex -space-x-4 md:-space-x-6 italic">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 md:w-16 h-12 md:h-16 rounded-[18px] md:rounded-[24px] border-4 border-[#050505] bg-[#0a0a0c] overflow-hidden shadow-2xl transition-all hover:translate-y-[-4px] hover:z-10 cursor-pointer italic shadow-inner">
                        <img src={`https://i.pravatar.cc/100?u=user${i + 52}`} alt="user" className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all italic" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-1 italic leading-none">
                    <span className="text-[8px] md:text-[10px] font-black text-[#b91c1c] uppercase tracking-[0.2em] md:tracking-[0.3em] italic leading-none">Live Users</span>
                    <span className="text-[14px] md:text-[15px] font-black text-white tracking-tighter leading-none italic uppercase italic">850k+ Trusted</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Login Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="mt-8 lg:mt-0 relative z-10 w-full md:w-[420px] lg:w-[480px] shrink-0 mx-auto lg:mx-0 italic"
            >
              <div className="p-1 w-full bg-gradient-to-b from-[#b91c1c]/20 to-transparent rounded-[48px] md:rounded-[64px] shadow-2xl italic">
                <div className="p-8 md:p-14 rounded-[46px] md:rounded-[62px] bg-[#0a0a0c] border border-white/5 relative overflow-hidden shadow-inner italic">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#b91c1c]/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 italic"></div>
                    <HomeLoginForm />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* --- ELITE STATS BAR --- */}
      <section className="px-6 md:px-16 pb-16 md:pb-32 relative z-10 animate-reveal italic">
        <div className="max-w-[1400px] mx-auto italic">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 p-8 md:p-20 bg-[#0a0a0c] border border-white/[0.03] rounded-[40px] md:rounded-[64px] shadow-2xl relative overflow-hidden group shadow-inner italic">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#b91c1c]/5 to-transparent pointer-events-none italic"></div>
                
                {[
                    { l: "Global Presence", v: "142+", i: "Countries" },
                    { l: "Avg. Delivery", v: "14s", i: "Instant" },
                    { l: "Uptime Rate", v: "99.9%", i: "Guaranteed" },
                    { l: "Daily Orders", v: "842k", i: "Active" }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="text-center lg:text-left space-y-3 md:space-y-4 relative z-10 italic"
                    >
                        <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] leading-none italic">{stat.l}</p>
                        <div className="flex flex-col gap-1 md:gap-2 italic">
                            <p className="text-3xl md:text-6xl font-black text-white italic tracking-tighter leading-none italic">{stat.v}</p>
                            <p className="text-[8px] md:text-[9px] font-black text-[#b91c1c] uppercase tracking-[0.1em] md:tracking-[0.2em] italic leading-none">{stat.i}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="px-6 md:px-16 py-16 md:py-32 relative z-10 italic">
        <div className="max-w-[1400px] mx-auto space-y-16 md:space-y-24 italic">
          <div className="text-center space-y-4 md:space-y-6 italic leading-none">
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none italic">Built for <span className="text-[#b91c1c] italic">Excellence</span></h2>
            <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] md:tracking-[0.6em] italic leading-none italic">The ultimate infrastructure for global social growth.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 italic">
            {[
              { title: "Premium Services", desc: "Expertly curated SMM services designed for high-quality results.", icon: Zap },
              { title: "Smart Payments", desc: "Seamless payment options across UPI, Crypto, and Net Banking.", icon: Wallet },
              { title: "Best Pricing", desc: "High efficiency providing the most competitive rates in the market.", icon: TrendingUp },
              { title: "Instant Result", desc: "Fast delivery across all major social media platforms.", icon: Globe }
            ].map((feat, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="bg-[#0a0a0c] border border-white/[0.03] p-10 md:p-16 rounded-[40px] md:rounded-[56px] text-center hover:border-[#b91c1c]/20 transition-all group flex flex-col items-center shadow-2xl shadow-inner italic"
              >
                <div className="w-20 md:w-24 h-20 md:h-24 rounded-[28px] md:rounded-[32px] bg-[#050505] border border-white/5 text-[#b91c1c] flex items-center justify-center mb-8 md:mb-10 group-hover:bg-[#b91c1c] group-hover:text-white transition-all shadow-2xl duration-500 italic">
                  <feat.icon className="w-8 md:w-10 h-8 md:h-10 italic" />
                </div>
                <h4 className="text-2xl md:text-2xl font-black text-white uppercase mb-3 md:mb-4 leading-none tracking-tighter italic">{feat.title}</h4>
                <p className="text-[10px] md:text-[11px] text-slate-800 font-black uppercase tracking-widest leading-relaxed opacity-70 italic">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEEP RED CTA BANNER --- */}
      <section className="px-6 md:px-16 py-16 md:pb-32 relative z-10 italic">
        <div 
            className="max-w-[1400px] mx-auto bg-[#b91c1c] rounded-[48px] md:rounded-[80px] p-12 md:p-32 flex flex-col items-center text-center gap-10 md:gap-14 shadow-2xl relative overflow-hidden italic"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-30 pointer-events-none animate-pulse italic"></div>
            <div className="relative z-10 space-y-8 md:space-y-10 max-w-5xl italic">
               <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase italic">
                  Ready to <br /> Start Growing?
               </h2>
               <p className="text-white/80 font-black text-lg md:text-2xl uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed max-w-3xl mx-auto italic">
                 Join the most powerful network of digital creators and brands globally.
               </p>
               <div className="pt-6 md:pt-10 italic">
                <Link href="/signup" className="h-20 md:h-24 px-12 md:px-20 border-4 border-[#050505] rounded-[28px] md:rounded-[40px] bg-[#050505] text-[#b91c1c] flex items-center justify-center font-black text-[16px] md:text-[18px] uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-transparent hover:text-white transition-all shadow-2xl active:scale-95 italic leading-none">
                    Create Account
                </Link>
               </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] border-t border-white/[0.03] px-6 md:px-16 py-16 md:py-32 relative z-10 font-sans italic">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-16 md:gap-24 italic">
          <div className="flex flex-col items-center gap-6 md:gap-8 italic">
            <div className="w-14 md:w-18 h-14 md:h-18 rounded-[20px] md:rounded-[24px] bg-[#0a0a0c] border border-white/5 flex items-center justify-center shadow-2xl text-[#b91c1c] italic">
              <Shield className="w-8 md:w-10 h-8 md:h-10 italic" />
            </div>
            <span className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none italic">SMM<span className="text-[#b91c1c] italic">12</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[9px] md:text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.5em] italic">
            <Link href="#" className="hover:text-[#b91c1c] transition-colors leading-none italic">Terms</Link>
            <Link href="#" className="hover:text-[#b91c1c] transition-colors leading-none italic">Privacy</Link>
            <Link href="#" className="hover:text-[#b91c1c] transition-colors leading-none italic">Refunds</Link>
            <Link href="#" className="hover:text-[#b91c1c] transition-colors leading-none italic">API</Link>
          </div>

          <div className="flex flex-col items-center gap-4 md:gap-6 italic">
            <p className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center italic">
                © 2026 SMM12 • THE WORLD&apos;S #1 CHOICE FOR GROWTH
            </p>
            <div className="h-1 w-12 md:w-16 bg-[#b91c1c]/10 rounded-full italic"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}
