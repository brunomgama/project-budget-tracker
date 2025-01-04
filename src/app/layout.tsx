/**
 * Import necessary types, fonts, global styles, and components.
 * - `Metadata` type for setting the metadata for the document head.
 * - `Geist` and `Geist_Mono` for loading Google fonts.
 * - `globals.css` for global CSS styles.
 * - `Sidebar` and `Header` components for consistent layout structure.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

/**
 * Configure custom Google fonts with variable CSS properties for use.
 * - `geistSans` for the primary sans-serif font.
 * - `geistMono` for the monospaced font.
 */
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * Metadata for the app's document head.
 * - `title`: Sets the page title.
 * - `description`: A short description for SEO purposes.
 * - `icons`: Specifies the app icon to be used.
 */
export const metadata: Metadata = {
    title: "Project Management App",
    description: "An app to track project budgets and expenses.",
    icons: {
        icon: "/main.png",
    },
};

/**
 * Root layout component for the app.
 * - Applies global styles, fonts, and consistent structure for all pages.
 * - Contains a `Sidebar` on the left and a `Header` at the top.
 * - The `children` prop represents the main content of the current page.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
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
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
        </body>
        </html>
    );
}
