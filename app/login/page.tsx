"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex items-center justify-center p-4 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] -z-10"></div>
      <div className="relative w-full max-w-[600px] flex flex-col items-stretch neubrutal-border bg-gray-900 shadow-neubrutal-lg">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-8 md:p-12">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-primary p-2 neubrutal-border shadow-neubrutal mb-6">
              <svg
                className="w-10 h-10 text-black"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase italic mb-2">
              Sign in to predictKaro
            </h1>
            <h2 className="text-primary text-sm font-bold uppercase tracking-widest mb-4">
              Back to the future of betting.
            </h2>
            <div className="h-1 w-20 bg-secondary"></div>
          </div>
          {/* Login Form */}
          <form
            className="w-full max-w-sm mx-auto flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Username
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-800/50 neubrutal-border p-4 text-white focus:ring-0 focus:border-primary placeholder:text-slate-500 font-medium"
                  placeholder="Enter your handle"
                  type="text"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">
                  alternate_email
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-800/50 neubrutal-border p-4 text-white focus:ring-0 focus:border-primary placeholder:text-slate-500 font-medium"
                  placeholder="••••••••"
                  type="password"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">
                  lock
                </span>
              </div>
              <div className="flex justify-end">
                <Link
                  className="text-xs font-bold uppercase text-secondary hover:underline"
                  href="#"
                >
                  Forgot?
                </Link>
              </div>
            </div>
            <button className="w-full bg-primary text-black font-black text-lg py-4 neubrutal-border shadow-neubrutal-lime hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-tighter">
              Sign In
            </button>
            <div className="flex items-center gap-4 my-2">
              <div className="h-[2px] flex-1 bg-slate-800"></div>
              <span className="text-xs font-bold text-slate-500 uppercase">
                Or vibe with
              </span>
              <div className="h-[2px] flex-1 bg-slate-800"></div>
            </div>
            <button className="w-full bg-white text-black font-bold text-base py-3 neubrutal-border shadow-neubrutal flex items-center justify-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Continue with Google
            </button>
          </form>
          {/* Footer links */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 font-medium">
              New to the future?
              <Link
                className="text-primary font-bold hover:underline ml-1 uppercase italic tracking-tighter"
                href="/create-account"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Floating Graphic Elements (Optional minimal decorative elements) */}
      <div
        className="fixed top-10 right-10 w-12 h-12 neubrutal-border bg-secondary shadow-neubrutal rotate-12 -z-10 hidden md:block"
        data-alt="Abstract purple square"
      ></div>
      <div
        className="fixed bottom-20 left-10 w-16 h-8 neubrutal-border bg-primary shadow-neubrutal -rotate-6 -z-10 hidden md:block"
        data-alt="Abstract lime green rectangle"
      ></div>
    </div>
  );
}
