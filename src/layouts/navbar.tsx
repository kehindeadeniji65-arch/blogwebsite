// layouts/navbar.tsx
"use client";
import LogoW from "@/organism/LogoW";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const router = useRouter();

  const navItems = [
    { name: "Home", link: "/", isActive: true },
    { name: "Overview", link: "/dashboard", isActive: true },
    { name: "About", link: "/about", isActive: true },
    { name: "Contact", link: "/contact", isActive: true },
  ];

  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const firstName = (user?.name || user?.email || "").split(" ")[0];

  return (
    <div className="flex bg-slate-900 shadow-lg justify-between items-center px-4 md:px-15 py-2.5 sticky top-0 z-30">
      <LogoW/>

      <ul className="hidden md:flex justify-between items-center w-[40%]">
        {navItems.map((navs, i) => (
          <li key={i} className={`hover:text-cyan-700 px-6 py-2 text-lg rounded-[25px] ${pathname == navs.link ? "text-cyan-700" : "text-white"}`}>
            <Link href={navs.link}>{navs.name}</Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <div className="w-9 h-9 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold uppercase">
              {(user.name || user.email || "U").charAt(0)}
            </div>
            <span className="font-semibold">Welcome, {user.name || user.email}</span>
          </>
        ) : (
          <>
            <button type="button" className="hover:bg-white hover:text-black bg-red-500/90 text-white text-1xl font-bold rounded-full px-4 py-2 ml-1">
              <Link href="/login">Login</Link>
            </button>
            <button type="button" className="hover:bg-cyan-200 hover:text-black text-white bg-cyan-700 text-1xl font-bold rounded-full px-4 py-2 ml-3">
              <Link href="/signup">Sign up for free</Link>
            </button>
          </>
        )}
      </div>

      {/* Mobile: circular avatar + first name, or Register link */}
      <div className="flex md:hidden items-center gap-2">
        {user ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{firstName}</span>
            <div className="w-8 h-8 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold uppercase text-sm">
              {(user.name || user.email || "U").charAt(0)}
            </div>
          </Link>
        ) : (
          <Link href="/signup" className="text-sm font-semibold text-cyan-500">
            Signup
          </Link>
        )}
      </div>
    </div>
  );
}