// layouts/dashboardSidebar.tsx
"use client";
import Logo from "@/organism/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  const navItems = [
    { name: "Home", link: "/", icon: "fa-solid fa-house" },
    { name: "Overview", link: "/dashboard", icon: "fa-solid fa-chart-line" },
    { name: "Posts", link: "/dashboard/posts", icon: "fa-solid fa-file-alt" },
    { name: "Settings", link: "/dashboard/settings", icon: "fa-solid fa-cog" },
    ...(isAdmin ? [{ name: "Admin Panel", link: "/dashboard/admin", icon: "fa-solid fa-shield-halved" }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex md:hidden items-center justify-between bg-white shadow-lg px-4 py-4 sticky top-0 z-40">
        <Logo/>
        <button onClick={() => setMenuOpen(true)}>
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 px-4 py-6 flex flex-col transform transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Logo/>
          <button onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {isAdmin && (
            <li>
              <Link
                href="/dashboard/admin"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-4 py-2 rounded-[25px] hover:text-cyan-700 ${
                  pathname === "/dashboard/admin" ? "text-cyan-700 bg-cyan-50" : ""
                }`}
              >
                <i className="fa-solid fa-shield-halved mr-2 w-5"></i>
                Admin Panel
              </Link>
            </li>
          )}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 rounded-[25px] text-red-500 hover:bg-red-50"
            >
              <i className="fa-solid fa-right-from-bracket mr-2 w-5"></i>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Desktop left sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 shrink-0 min-h-screen bg-white shadow-lg px-4 py-6 sticky top-0">
        <Logo/>
        <ul className="flex flex-col gap-1 mt-8">
          {navItems.map((navs, i) => (
            <li key={i}>
              <Link
                href={navs.link}
                className={`block px-4 py-2 rounded-[25px] hover:text-cyan-700 ${pathname === navs.link ? "text-cyan-700" : ""}`}
              >
                <i className={`${navs.icon} mr-2`}></i>
                {navs.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}