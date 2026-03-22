"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
    sessionKey?: string;
}

export default function SplashScreen({ sessionKey }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (sessionKey) {
            const hasSeen = sessionStorage.getItem(sessionKey);
            if (!hasSeen) {
                setIsVisible(true);
                sessionStorage.setItem(sessionKey, "true");
            }
        } else {
            setIsVisible(true);
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4000); // 4 seconds

        return () => clearTimeout(timer);
    }, [sessionKey]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center p-6 italic overflow-hidden"
                >
                    {/* Minimal Background Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.08)_0%,transparent_70%)] animate-pulse italic"></div>

                    <div className="relative flex flex-col items-center gap-6 text-center italic">
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-7xl md:text-[140px] font-black text-white tracking-tighter uppercase italic leading-none"
                        >
                            SMM<span className="text-[#b91c1c] italic">12</span>
                        </motion.h1>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="flex items-center justify-center gap-3 italic"
                        >
                            <p className="text-[10px] md:text-[12px] font-black text-slate-900 uppercase tracking-[0.6em] md:tracking-[1em] leading-none italic animate-pulse">
                                INITIALIZING...
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
