"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiBox,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiLayers,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { MOCK_ADMIN_PROFILE } from "@/app/lib/mockData";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { href: "/admin/products", label: "Products", icon: FiBox },
  { href: "/admin/categories", label: "Categories", icon: FiLayers },
  { href: "/admin/inventory", label: "Inventory", icon: FiPackage },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileMenuOpen((prev) => !prev);
      return;
    }
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <div
          className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "lg:w-24" : "lg:w-72"} w-72 lg:translate-x-0`}
        >
          <div className="flex h-full flex-col p-5">
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
              <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-600">
                  Commerce Hub
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Admin Console
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  className="rounded-full bg-indigo-100 p-2 text-indigo-600 transition hover:bg-indigo-200"
                  aria-label="Toggle sidebar"
                >
                  {sidebarCollapsed ? (
                    <FiChevronRight size={16} />
                  ) : (
                    <FiChevronLeft size={16} />
                  )}
                </button>
                <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                  <FiBox size={16} />
                </div>
              </div>
            </div>

            <div
              className={`mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${sidebarCollapsed ? "px-3" : ""}`}
            >
              <div
                className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <Image
                  src={MOCK_ADMIN_PROFILE.avatar}
                  alt={MOCK_ADMIN_PROFILE.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                {!sidebarCollapsed ? (
                  <div>
                    <p className="font-semibold text-slate-900">
                      {MOCK_ADMIN_PROFILE.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {MOCK_ADMIN_PROFILE.role}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    } ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
                    title={sidebarCollapsed ? item.label : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span
                      className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}
                    >
                      <Icon size={16} />
                      {!sidebarCollapsed ? <span>{item.label}</span> : null}
                    </span>
                    {!sidebarCollapsed ? <FiChevronRight size={14} /> : null}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-600">
                This week
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">+24%</p>
              {!sidebarCollapsed ? (
                <p className="mt-1 text-sm text-slate-600">
                  Sales momentum looks strong.
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <div className={`flex-1 ${sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"}`}>
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm"
                  onClick={toggleSidebar}
                  aria-label="Toggle navigation"
                >
                  {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </button>
                <div>
                  <p className="text-sm text-slate-500">Operations overview</p>
                  <h1 className="text-xl font-semibold text-slate-900">
                    Modern Commerce Admin
                  </h1>
                </div>
              </div>
              <div className="hidden items-center gap-3 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 sm:flex">
                <FiPackage />
                <span>Live inventory sync ready</span>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
