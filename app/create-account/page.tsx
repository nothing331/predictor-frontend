"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CreateAccount() {
  return (
    <div className="bg-slate-900 font-display text-slate-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#7bf425] p-3 border-4 border-black neubrutalist-shadow-sm mb-4">
            <span className="material-symbols-outlined text-black text-4xl font-bold">
              query_stats
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            predictKaro
          </h1>
        </div>
        {/* Main Container */}
        <div className="bg-slate-800 border-[4px] border-black neubrutalist-shadow p-8 w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold leading-tight text-white mb-2">
              CREATE YOUR PREDICTKARO ACCOUNT
            </h2>
            <p className="text-[#7bf425] font-bold text-sm tracking-widest uppercase">
              Join the future of betting.
            </p>
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-700 border-2 border-black p-4 text-white focus:ring-0 focus:border-[#7bf425] placeholder:text-slate-500 font-medium"
                  placeholder="Enter your username"
                  type="text"
                />
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-700 border-2 border-black p-4 text-white focus:ring-0 focus:border-[#7bf425] placeholder:text-slate-500 font-medium"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
            </div>
            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-700 border-2 border-black p-4 text-white focus:ring-0 focus:border-[#7bf425] placeholder:text-slate-500 font-medium"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            {/* Primary Button */}
            <button
              className="w-full bg-[#7bf425] text-black font-black py-4 border-4 border-black neubrutalist-shadow-sm neubrutalist-shadow-hover transition-all uppercase tracking-tighter text-lg"
              type="submit"
            >
              Create Account
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-2 border-slate-700"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase">
                Or continue with
              </span>
              <div className="flex-grow border-t-2 border-slate-700"></div>
            </div>
            {/* Google Button */}
            <button
              className="w-full bg-white text-black font-bold py-3 border-2 border-black neubrutalist-shadow-sm neubrutalist-shadow-hover transition-all flex items-center justify-center gap-3"
              type="button"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3fxYVt9uj3aYIlUhgKga5GJOUB_2gPRYApNA9Et4xwbJD1cKomNGNxi8ny7lob9qoEv1CEG-1n9J7GkVo147zOZhwR5d5DdjSJcR-MZ2-6PxveZzk_OnBXleDKipBNp3t7KexVdq9A84qvlV7fZCByuwaEJbnsOMHoLSn83FATcLAQbft1QRH3nB17f6uqOdMVz1NUEh7FVImp0DkgXCCDuO7YGHhhA9-LRazTUhEob29Q-yTjNFW7prE8isCAse1VSzz6k-Gg9sB"
              />
              <span>SIGN UP WITH GOOGLE</span>
            </button>
          </form>
        </div>
        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 font-medium">
            Already have an account?
            <Link
              className="text-[#7bf425] font-bold underline decoration-2 underline-offset-4 hover:text-white transition-colors"
              href="/login"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 -z-10 opacity-20 hidden lg:block">
        <div className="w-32 h-32 bg-[#7bf425] border-4 border-black neubrutalist-shadow rotate-12"></div>
      </div>
      <div className="fixed bottom-10 right-10 -z-10 opacity-20 hidden lg:block">
        <div className="w-48 h-48 bg-slate-700 border-4 border-black neubrutalist-shadow -rotate-6"></div>
      </div>
    </div>
  );
}
