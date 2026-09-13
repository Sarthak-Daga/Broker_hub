"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", icon: "▦", href: "/dashboard" },
  { name: "Marketing", icon: "📢", href: "/marketing" },
  { name: "Buyers / Sellers", icon: "🏠", href: "/buyers-sellers" },
  { name: "Contacts", icon: "👥", href: "/contacts" },
  { name: "Follow-ups", icon: "↻", href: "/follow-ups" },
  { name: "Employees", icon: "♙", href: "/employees" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 border-r border-slate-800 bg-slate-950 md:block">
      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="w-5 text-center">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}