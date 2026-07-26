"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const signin = pathname === "/signin";

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#f7f9fb] font-['Inter']">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white rounded-xl shadow-2xl min-h-170">
        {/* Left Side: Editorial Content (Shared) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-indigo-700 to-indigo-500 text-white relative">
          <div className="z-10">
            <h1 className="font-['Manrope'] text-4xl font-extrabold tracking-tighter mb-4">
              RoyalCart{" "}
            </h1>
            <p className="text-lg opacity-90 max-w-sm">
              The destination for architectural editorial and curated lifestyle
              essentials.
            </p>
          </div>
          <div className="z-10">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest opacity-70 block mb-2">
                Featured Series
              </span>
              <h2 className="font-['Manrope'] text-2xl font-bold italic">
                The Art of Minimalist Living
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRf5Z1gaiU-2m49F74WHU7JGOtTzDKNH0ZAifGgn7t6hblxW_MBe4632UDTrqk0-rfKDb4-py0N4VV-WJSYoW_ROVewFJ6N0BzLHy7Vj4AS3F50lCoP_iBBtYNBxd43sKkIrih_ZVVJkRhp83cJ2TqMKSY5X9_pH6_I2IvqjA6heKW9JMhor3P3sGKYo7EItDdYehpMSqe7A8sme24Ar_rvrVwcHHiz6O-IPyT2y7s-7D-_c-X7jKtKNCWGnR8rJXUz7YmRUJH3vw"
                  alt="Elena Vance"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold">Elena Vance</p>
                <p className="text-xs opacity-70">Editorial Director</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0LJQxbmXNekH_s0UhXFF3l_D2TgCuwuq1JT_j80gLXyljWDPp38ZRVRHN5kUSXRuaLDXptcPgVavA5qV5enHulPEEiaR67Jg8u8PZwk8n9jFSxFDKhrzegoIvAJqVfmKb3At4_lyM-h7qQMyxyhWMkPwaqPHl8O9KOObdKiWryByng9XlWi0IWzp8-nbIt6rT7z28WYCqpmWmmql2mfPhFbx2roqAkgGYUrG7uqqp3PiJ00Ko3hF6PV4N4dIK7TSY6W5g3jmjR9w"
              alt="Background"
              fill
              className="object-cover grayscale mix-blend-overlay"
            />
          </div>
        </div>

        {/* Right Side: Navigation + Content */}
        <div className="p-8  md:p-12 lg:p-16 flex flex-col justify-start bg-white">
          {/* Tab Navigation with Dynamic Sliding Bar */}
          <div className="relative flex gap-8 mb-12 border-b border-[#eceef0] shrink-0">
            <Link
              href="/signin"
              className={`pb-4 font-['Manrope'] text-xl font-bold transition-colors ${signin ? "text-[#191c1e]" : "text-[#464555] hover:text-[#3525cd]"}`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`pb-4 font-['Manrope'] text-xl font-bold transition-colors ${!signin ? "text-[#191c1e]" : "text-[#464555] hover:text-[#3525cd]"}`}
            >
              Sign Up
            </Link>

            {/* The Animated Bar */}
            <div
              className="absolute bottom-0 h-1 bg-[#3525cd] transition-all duration-300 ease-in-out"
              style={{
                width: signin ? "69px" : "80px",
                left: signin ? "0px" : "97px",
              }}
            />
          </div>
          <div className="grow">{children}</div>
        </div>
      </div>
    </main>
  );
}
