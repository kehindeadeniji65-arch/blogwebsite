  "use client";
import Logo from "@/organism/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (

<div className="flex bg-white shadow-lg justify-between items-center px-4 md:px-15 py-1.5 sticky top-0">
  <Logo/>

  <ul className="hidden md:flex justify-between items-center w-[40%]">
    {navItems.map((navs, i) => (
      <li key={i} className={`hover:text-cyan-700 px-6 py-2 text-lg rounded-[25px] ${pathname == navs.link ? "text-cyan-700" : ""}`}>
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
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-cyan-700 ml-2">
          Logout
        </button>
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

  <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
    <i className="fa-solid fa-bars text-sm"></i>
  </button>

  {menuOpen && (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center gap-2 py-4 md:hidden">
      {navItems.map((navs, i) => (
        <Link key={i} href={navs.link} className={pathname == navs.link ? "text-cyan-700" : ""}>{navs.name}</Link>
      ))}
      {user ? (
        <>
          <p className="font-semibold">Welcome, {user.name || user.email}</p>
          <button onClick={handleLogout} className="text-white bg-gray-500 font-bold rounded-sm px-4 py-2 w-[80%] text-center">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-white bg-green-300 font-bold rounded-sm px-4 py-2 w-[80%] text-center">Login</Link>
          <Link href="/signup" className="text-white bg-orange-500 font-bold rounded-sm px-4 py-2 w-[80%] text-center">Sign up for free</Link>
        </>
      )}
    </div>
  )}
</div>
  );
}