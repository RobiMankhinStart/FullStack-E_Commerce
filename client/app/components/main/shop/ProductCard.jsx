"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/store/useCartStore";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const isCartDisabledForRole = (() => {
    if (typeof window === "undefined") return false;

    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("X-AS-Token="));

    if (!tokenCookie) return false;

    try {
      const token = decodeURIComponent(tokenCookie.split("=")[1]);
      const payload = token.split(".")[1];
      if (!payload) return false;

      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(
        Math.ceil(normalized.length / 4) * 4,
        "=",
      );
      const decoded = atob(padded);
      const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      const role = JSON.parse(json)?.role;
      return ["admin", "editor"].includes(String(role || "").toLowerCase());
    } catch (error) {
      return false;
    }
  })();

  const originalPrice = product.price || 0;
  const discount = product.discountPercentage || 0;
  const discountedPrice =
    discount > 0
      ? Math.round(originalPrice - (originalPrice * discount) / 100)
      : originalPrice;

  // Handle tags mapping securely
  const tagsList = product.tags
    ? product.tags
        .flatMap((t) => (typeof t === "string" ? t.split(",") : t))
        .map((s) => s?.trim())
        .filter(Boolean)
    : [];

  const handleAddToCart = (e) => {
    // Prevent the click from bubbling up to the Link component
    e.preventDefault();
    e.stopPropagation();

    if (isCartDisabledForRole) {
      toast.warning("Admin and editor accounts cannot add products to cart.");
      return;
    }

    const selectedSku = product.variants?.[0]?.sku || product.sku;

    if (!selectedSku) {
      toast.warning("Please select a variant or check product SKU");
      return;
    }

    addToCart(product._id, selectedSku, 1, product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
      {/* 1. Image Area (Clickable to details) */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/5] w-full bg-[#f8f9fa] overflow-hidden"
      >
        <Image
          src={product.thumbnail || product.image || "/placeholder.jpg"}
          alt={product.title || product.name || "Product image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Discount Badge overlay */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm z-10">
            -{discount}%
          </div>
        )}
      </Link>

      {/* 2. Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Tags / Category (Subtle) */}
        {tagsList.length > 0 && (
          <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 truncate">
            {tagsList[0]}
          </div>
        )}

        {/* Title (Clickable) */}
        <Link href={`/shop/${product.slug}`}>
          <h2 className="font-medium text-gray-900 text-sm md:text-base line-clamp-1 group-hover:text-black transition-colors">
            {product.title || product.name}
          </h2>
        </Link>

        {/* Spacer to push pricing to the bottom if titles vary in lines */}
        <div className="flex-grow" />

        {/* 3. Pricing & Cart Action */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 leading-none">
              ৳{discountedPrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through mt-1">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Modern Circular Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isCartDisabledForRole}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90 ${
              isCartDisabledForRole
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
            aria-label={
              isCartDisabledForRole
                ? "Cart unavailable for this role"
                : "Add to cart"
            }
            title={
              isCartDisabledForRole
                ? "Cart unavailable for this role"
                : "Add to cart"
            }
          >
            {/* Sleek Shopping Bag Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
