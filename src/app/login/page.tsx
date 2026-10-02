"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import Logo from "@/organism/Logo";

export default function page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setShowSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {showSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i>
          Login successful! Redirecting...
        </div>
      )}

      {/* Left - Login form */}
      <div className="flex justify-center items-center w-full lg:w-1/2 px-4 py-10 bg-linear-to-br from-cyan-700 via-cyan-500 to-cyan-300 lg:bg-white">
        <div className="w-full max-w-md bg-white lg:shadow-none shadow-xl rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex lg:hidden justify-center mb-6">
            <Logo/>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-1 mb-7">Log in to continue to your dashboard.</p>

          <form onSubmit={handleLogin} autoComplete="off" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-cyan-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold w-full py-3 rounded-xl text-sm sm:text-base transition flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-cyan-700 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Logo & brand panel, desktop only */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-linear-to-br from-cyan-600 via-cyan-500 to-cyan-300 px-10 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10"></div>
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