import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Explicit weights for accurate rendering
});

export const metadata: Metadata = {
  title: "smm12",
  description: "Advanced Social Media Marketing Services",
};

import { AuthProvider } from "@/lib/AuthContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import ThemeHandler from "@/components/ThemeHandler";
import NetworkStatusHandler from "@/components/NetworkStatusHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <NetworkStatusHandler />
          <MaintenanceGuard>
            <ThemeHandler />
            {children}
          </MaintenanceGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
