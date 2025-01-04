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
    { icon: <TbHome size={24} />, label: "Home", href: "/" },
    { icon: <TbLayoutDashboard size={24} />, label: "Projects", href: "/projects" },
    { icon: <TbUserCircle size={24} />, label: "Managers", href: "/managers" },
    { icon: <TbCurrencyDollar size={24} />, label: "Budgets", href: "/budgets" },
    { icon: <TbTags size={24} />, label: "Categories", href: "/categories" },
    { icon: <TbReportMoney size={24} />, label: "Expenses", href: "/expenses" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={`h-full text-white flex flex-col py-4 w-16 transition-all`}>
            <div className="flex items-center gap-4 px-4 py-3">
                <TbLayoutDashboard size={24} className="text-indigo-300" />
            </div>

            <ul className="w-full mt-6">
                {menuItems.map((item, index) => (
                    <li key={index} className="relative group">
                        <Link
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 hover:bg-indigo-600 hover:text-white rounded-r-lg transition-colors ${
                                pathname === item.href ? 'bg-indigo-600 text-white' : 'text-gray-300'
                            }`}
                        >
                            <div className="relative flex justify-center items-center">
                                <div className={`text-${pathname === item.href ? 'white' : 'gray-900'}`}>
                                    {item.icon}
                                </div>
                                <span className="absolute ml-2 left-12 z-10 hidden group-hover:inline-block bg-gray-900
                                        text-white text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
