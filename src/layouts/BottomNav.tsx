// layouts/bottomNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", link: "/", icon: "fa-solid fa-house" },
    { name: "Overview", link: "/dashboard", icon: "fa-solid fa-chart-pie" },
    { name: "Posts", link: "/dashboard/posts", icon: "fa-solid fa-file-alt" },
    { name: "Settings", link: "/dashboard/settings", icon: "fa-solid fa-cog" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 flex justify-around items-center py-2 z-40 md:hidden">
      {navItems.map((item, i) => {
        const active = pathname === item.link;
        return (
          <Link
            key={i}
            href={item.link}
            className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
              active ? "text-orange-500" : "text-white/70"
            }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}