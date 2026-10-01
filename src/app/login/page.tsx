"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import GoogleLoginButton from "@/atoms/googleLoginButton";
import Logo from "@/organism/Logo";

export default function page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  console.log("handleLogin fired");
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("https://blog-backend-0ieo.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

 localStorage.setItem("token", data.token);
setShowSuccess(true);

setTimeout(() => {
  router.push('/dashboard');
}, 1500);
  } catch (err) {
    setError("Something went wrong");
  }
};

  return (
    <div className="flex min-h-screen">
      {showSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
           Login successful! Redirecting...
        </div>
      )}

      {/* Left - Login form */}
      <div className="flex justify-center items-center w-full lg:w-1/2 px-4 bg-linear-to-r from-cyan-700 via-cyan-350 to-cyan-300 lg:bg-white">
       
        <div className="py-6 sm:py-8 flex flex-col justify-center shrink-0 w-full max-w-100 backdrop-blur-lg border border-white/10 bg-white/20 lg:backdrop-blur-lg lg:border lg:border-white/10 bg-white/20rounded-lg px-5 sm:px-8">
        
          <div className="flex lg:hidden justify-center mb-4">
                      <Logo/>
                    </div>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-7">Login</h2>

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="flex flex-col mb-3">
              <label htmlFor="name" className="text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete=""
                className="outline-none bg-white shadow-lg p-2 my-2 rounded-[12px] text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="new-password"
                className="outline-none bg-white shadow-lg p-2 my-2 rounded-[12px] text-sm sm:text-base"
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="bg-linear-to-r from-purple-500 to-blue-900 text-lg sm:text-2xl text-white font-bold w-full my-4 py-2.5 rounded-[16px]">
              Log in
            </button>
          </form>
          <GoogleLoginButton mode="login" />
          <div className="mt-5 flex flex-wrap justify-center gap-1 px-4 sm:px-10 text-sm sm:text-base">
            <p>Not register yet?</p>
            <Link href="/signup" className="underline hover:text-white">
                Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right - Logo & brand panel, desktop only */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-linear-to-r from-cyan-500 via-cyan-250 to-cyan-300 px-10 text-center">
        <Logo/>
        <p className="mt-6 text-2xl font-bold text-white max-w-md">
          Blogs on product management & user feedback
        </p>
        <p className="mt-3 text-white/80 max-w-sm">
          Sign in to keep up with fresh insights from the Creativity Redefined team.
        </p>
      </div>
    </div>
  );
}