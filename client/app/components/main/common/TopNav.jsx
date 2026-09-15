"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Search,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import { UserMenuItem } from "./UserMenuItem";
import Button from "../../commonUI/Button";
import Input from "../../commonUI/Input";
import { useCartStore } from "@/app/store/useCartStore";

const TopNav = () => {
  const router = useRouter();
  const searchRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Cart Store State
  const { openCart, cartItems, fetchCart } = useCartStore();
  const totalCartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
    fetchCart();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/auth/profile");
        const currentEmail = response?.data?.email;

        if (currentEmail) {
          setAuthState({
            status: "authenticated",
            role: response?.data?.role,
            email: currentEmail,
          });
        } else {
          setAuthState({ status: "guest", role: null, email: null });
        }
      } catch {
        setAuthState({ status: "guest", role: null, email: null });
      }
    };

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    fetchProfile();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchCart]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiClient.get(
          `/product?search=${encodeURIComponent(searchQuery)}`,
        );
        const data =
          res?.data?.productList ||
          res?.data?.data?.productList ||
          res?.data ||
          [];
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Search fetch error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await apiClient.post("/auth/signout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setAuthState({ status: "guest", role: null, email: null });
      setIsUserMenuOpen(false);
      setIsLoggingOut(false);
      router.push("/signin");
      router.refresh();
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
      <div className="max-w-screen-2xl mx-auto px-8 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-slate-900 shrink-0"
        >
          RoyalCart
        </Link>

        {/* Search Bar Container */}
        <div
          ref={searchRef}
          className="relative hidden lg:block flex-1 max-w-md"
        >
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            leftIcon={<Search size={16} />}
            rightIcon={searchQuery ? <X size={14} /> : null}
            rightIconAction={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="rounded-full! bg-slate-100/80! hover:bg-slate-100! focus:bg-white! text-slate-900! text-xs! font-semibold! border-transparent! focus:border-slate-200! focus:ring-0! shadow-inner"
          />

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
              >
                {searchQuery.trim() === "" ? (
                  <div className="p-6 text-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                    Type to search...
                  </div>
                ) : isSearching ? (
                  <div className="p-6 text-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                    No product found.
                  </div>
                ) : (
                  <div className="max-h-104 overflow-y-auto p-2 flex flex-col gap-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/shop/${product._id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50/50 hover:shadow-sm border border-transparent hover:border-indigo-100 transition-all duration-300"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-inner flex items-center justify-center">
                          {product.image || product.thumbnail ? (
                            <Image
                              src={product.image || product.thumbnail}
                              alt={product.title || product.name || "Product"}
                              fill
                              sizes="56px"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">
                              IMG
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {product.title || product.name}
                          </p>
                          <p className="text-xs font-black text-indigo-500 mt-0.5">
                            ${product.price}
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowRight size={14} className="text-indigo-600" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
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
            <button
              onClick={openCart}
              className="text-slate-900 hover:text-indigo-600 transition-colors relative cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  rounded="full"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8! h-8! bg-slate-100 border border-slate-200 text-slate-900! hover:text-indigo-600!"
                >
                  <User size={18} />
                </Button>

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

                      <Button
                        variant="logout"
                        fullWidth
                        loading={isLoggingOut}
                        onClick={handleLogout}
                        leftIcon={<LogOut size={16} />}
                        className="mt-1 py-3! px-4! text-sm! font-bold!"
                      >
                        {isLoggingOut ? "Signing out..." : "Sign Out"}
                      </Button>
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

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-900! hover:bg-slate-100!"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-8 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={16} />}
                rightIcon={searchQuery ? <X size={14} /> : null}
                rightIconAction={() => setSearchQuery("")}
                className="rounded-full! bg-slate-100! text-slate-900! text-xs! font-semibold! border-transparent! focus:border-slate-200! focus:ring-0! shadow-inner"
              />

              {searchResults.length > 0 && (
                <div className="mt-4 flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/shop/${product._id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        {product.image || product.thumbnail ? (
                          <Image
                            src={product.image || product.thumbnail}
                            alt={product.title || product.name || "Product"}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400">
                              IMG
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {product.title || product.name}
                        </p>
                        <p className="text-xs font-black text-indigo-500 mt-0.5">
                          ${product.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

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

export default TopNav;
