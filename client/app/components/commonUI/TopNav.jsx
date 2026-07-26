"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";

const CART_STORAGE_KEY = "curator_cart";
const CART_OWNER_KEY = "curator_cart_owner";

const clearCartStorage = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
  window.localStorage.removeItem(CART_OWNER_KEY);
  window.dispatchEvent(new Event("curator_cart_updated"));
};

const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authState, setAuthState] = useState({
    status: "loading",
    role: null,
    email: null,
  });

  const isLoggedIn = authState.status === "authenticated";
  const isAdminUser = ["admin", "editor"].includes(authState.role);
  const dashboardHref = isAdminUser ? "/admin/dashboard" : "/profile";
  const dashboardLabel = isAdminUser ? "Admin Dashboard" : "Customer Dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const updateCartCount = () => {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!storedCart) {
        setCartCount(0);
        return;
      }
      try {
        const items = JSON.parse(storedCart);
        if (!Array.isArray(items)) {
          setCartCount(0);
          return;
        }
        setCartCount(
          items.reduce((total, item) => total + (item.quantity || 0), 0),
        );
      } catch {
        setCartCount(0);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/auth/profile");
        const currentEmail = response?.data?.email;
        const storedOwner = window.localStorage.getItem(CART_OWNER_KEY);
        const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

        if (storedOwner && currentEmail && storedOwner !== currentEmail) {
          clearCartStorage();
        }

        if (currentEmail) {
          window.localStorage.setItem(CART_OWNER_KEY, currentEmail);
          setAuthState({
            status: "authenticated",
            role: response?.data?.role,
            email: currentEmail,
          });
        } else {
          if (storedOwner && !storedCart) {
            window.localStorage.removeItem(CART_OWNER_KEY);
          }
          setAuthState({ status: "guest", role: null, email: null });
        }
      } catch {
        const storedOwner = window.localStorage.getItem(CART_OWNER_KEY);
        if (storedOwner) {
          clearCartStorage();
        } else {
          window.localStorage.removeItem(CART_OWNER_KEY);
        }
        setAuthState({ status: "guest", role: null, email: null });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("curator_cart_updated", updateCartCount);
    window.addEventListener("beforeunload", clearCartStorage);
    window.addEventListener("pagehide", clearCartStorage);
    updateCartCount();
    fetchProfile();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("curator_cart_updated", updateCartCount);
      window.removeEventListener("beforeunload", clearCartStorage);
      window.removeEventListener("pagehide", clearCartStorage);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await apiClient.post("/auth/signout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearCartStorage();
      setAuthState({ status: "guest", role: null, email: null });
      setIsUserMenuOpen(false);
      setIsLoggingOut(false);
      window.location.href = "/signin";
    }
  };

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-slate-900"
        >
          RoyalCart
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {(authState.status === "guest" || authState.role === "user") && (
            <Link
              href="/cart"
              className="text-slate-900 hover:text-indigo-600 transition-colors relative"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          )}

          <div className="relative">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="cursor-pointer flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Account
                        </p>
                        <p className="text-sm font-black text-slate-900 truncate">
                          {authState.email || "Member account"}
                        </p>
                      </div>

                      <UserMenuItem
                        href={dashboardHref}
                        icon={<LayoutDashboard size={16} />}
                        label={dashboardLabel}
                      />

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <LogOut size={16} />
                        {isLoggingOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <User size={20} strokeWidth={2} />
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-8 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-black tracking-tighter text-slate-900"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            {isLoggedIn ? (
              <Link
                href={dashboardHref}
                className="text-lg font-bold text-indigo-600"
              >
                {dashboardLabel}
              </Link>
            ) : (
              <Link
                href="/signin"
                className="text-lg font-bold text-indigo-600"
              >
                Member Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const UserMenuItem = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors"
  >
    {icon}
    {label}
  </Link>
);

export default TopNav;
