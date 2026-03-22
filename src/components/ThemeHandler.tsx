"use client";

import { useEffect } from "react";

export default function ThemeHandler() {
    useEffect(() => {
        const currentTheme = localStorage.getItem("smm-theme") || "default";
        document.documentElement.setAttribute("data-theme", currentTheme);

        const applyTheme = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    const color = data.themeColor || "#b91c1c";
                    document.documentElement.style.setProperty("--accent-red", color);
                }
            } catch (e) {
                console.error("Theme fetch failed");
            }
        };

        applyTheme();
    }, []);

    return null;
}
