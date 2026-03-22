"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function NetworkStatusHandler() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999999] bg-[#050505] flex flex-col items-center justify-center p-6 italic overflow-hidden"
                >
                    {/* Minimal Background Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.1)_0%,transparent_70%)] animate-pulse italic"></div>
                    
                    <div className="relative flex flex-col items-center gap-12 text-center italic">
                        <motion.h1 
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="text-7xl md:text-[140px] font-black text-white tracking-tighter uppercase italic leading-none"
                        >
                            SMM<span className="text-[#b91c1c] italic">12</span>
                        </motion.h1>

                        <div className="space-y-6 italic">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none opacity-40">
                                CONNECTION <span className="text-[#b91c1c] italic">LOST</span>
                            </h2>

                            <div className="flex items-center justify-center gap-4 italic pt-4">
                                <div className="w-2 h-2 rounded-full bg-[#b91c1c] animate-ping italic"></div>
                                <p className="text-[10px] md:text-[12px] font-black text-slate-900 uppercase tracking-[0.6em] md:tracking-[1em] leading-none italic animate-pulse">
                                    AWAITING SIGNAL...
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
