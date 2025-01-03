"use client"

import Link from 'next/link';
import {
    TbLayoutDashboard,
    TbHome,
    TbUserCircle,
    TbCurrencyDollar,
    TbTags,
    TbReportMoney
} from 'react-icons/tb';
import {usePathname} from "next/navigation";

const menuItems = [
    { icon: <TbHome size={32} />, label: "Home", href: "/" },
    { icon: <TbLayoutDashboard size={32} />, label: "Projects", href: "/projects" },
    { icon: <TbUserCircle size={32} />, label: "Managers", href: "/managers" },
    { icon: <TbCurrencyDollar size={32} />, label: "Budgets", href: "/budgets" },
    { icon: <TbTags size={32} />, label: "Categories", href: "/categories" },
    { icon: <TbReportMoney size={32} />, label: "Expenses", href: "/expenses" },
];

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-full bg-dark text-light flex flex-col py-4"
            style={{ backgroundColor: "var(--color-dark)", color: "var(--color-light)" }}>
            <div className="flex items-center gap-4 px-4 py-3">
                <TbLayoutDashboard size={32} />
                <span className="text-lg font-bold">Logo</span>
            </div>

            <ul className="w-full mt-6">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-700 transition-colors ${pathname === item.href ? 'bg-gray-700' : ''}`}
                        >
                            <div>{item.icon}</div>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
