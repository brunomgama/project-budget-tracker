import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Project Management App",
    description: "An app to track project budgets and expenses.",
    icons: {
        icon: "/main.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            style={{
                backgroundColor: "var(--color-light)",
                color: "var(--color-darker)",
            }}
        >
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
        </body>
        </html>
    );
}
