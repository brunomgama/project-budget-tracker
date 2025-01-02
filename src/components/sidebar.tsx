import Link from 'next/link';
import { TbLayoutDashboard, TbHome } from 'react-icons/tb';

const menuItems = [
    { icon: <TbHome size={32} />, label: "Home", href: "/" },
    { icon: <TbLayoutDashboard size={32} />, label: "Projects", href: "/projects" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-full bg-dark text-light flex flex-col py-4"
            style={{ backgroundColor: "var(--color-dark)", color: "var(--color-light)" }}>
            <div className="flex items-center gap-4 px-4 py-3">
                <TbLayoutDashboard size={32} />
                <span className="text-lg font-bold">Logo</span>
            </div>

            <ul className="w-full">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-700 transition-colors"
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
