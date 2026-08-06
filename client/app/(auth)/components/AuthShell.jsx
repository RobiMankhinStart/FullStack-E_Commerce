"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiShield, FiStar } from "react-icons/fi";

const highlights = [
  "Secure account access",
  "Fast checkout and saved preferences",
  "Modern account management",
];

export default function AuthShell({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerHref,
}) {
  const pathname = usePathname();
  const isSignin = pathname?.includes("signin");
  const isSignup = pathname?.includes("signup");
  const isOtp = pathname?.includes("verifyotp");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_32%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur xl:flex-row">
        <section className="relative flex-1 overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(129,140,248,0.35),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(30,41,59,0.9))]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-100">
                <FiStar size={14} />
                Commerce account portal
              </div>
              <h1 className="mt-6 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                Welcome back to your storefront control center.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Create a new account or sign in to manage orders, preferences,
                and your personal shopping experience with clarity.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200"
                >
                  <FiShield className="text-indigo-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex-1 bg-slate-50/70 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">
                  {isOtp
                    ? "Verification"
                    : isSignup
                      ? "Create account"
                      : "Welcome"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {title}
                </h2>
              </div>
              <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                {isOtp ? "Step 2/2" : isSignup ? "Step 1/2" : "Ready"}
              </div>
            </div>

            <p className="mb-6 text-sm leading-7 text-slate-500">
              {description}
            </p>
            {children}

            {footerText ? (
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <span>{footerText}</span>
                <Link
                  href={footerHref}
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  {footerLink}
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
