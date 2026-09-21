"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import { FeatureItem } from "@/app/components/main/shop/FeatureItem";
import { toast } from "sonner";
import { useCartStore } from "@/app/store/useCartStore";

const ProductDetailClient = ({ product }) => {
  const { addToCart } = useCartStore();

  const galleryImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.thumbnail || "/placeholder-image.jpg"];
  }, [product]);

  const colorSizeOptions = useMemo(() => {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const grouped = new Map();

    variants.forEach((variant) => {
      const color = String(variant.color || "").trim();
      const size = String(variant.size || "")
        .trim()
        .toLowerCase();
      const stock = Number(variant.stock || 0);

      if (!color || !size) return;

      if (!grouped.has(color)) {
        grouped.set(color, {
          label: color,
          totalStock: 0,
          sizes: [],
        });
      }

      const colorEntry = grouped.get(color);
      colorEntry.totalStock += stock;

      const existingSize = colorEntry.sizes.find(
        (entry) => entry.label.toLowerCase() === size,
      );

      if (existingSize) {
        existingSize.stock += stock;
        existingSize.variantSku = existingSize.variantSku || variant.sku;
      } else {
        colorEntry.sizes.push({
          label: size.toUpperCase(),
          stock,
          variantSku: variant.sku,
        });
      }
    });

    return [...grouped.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [product]);

  const selectedColorOptions = useMemo(() => {
    if (colorSizeOptions.length === 0) return [];
    return colorSizeOptions.map((item) => item.label);
  }, [colorSizeOptions]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    () => selectedColorOptions[0] || "",
  );
  const [selectedSize, setSelectedSize] = useState(() => {
    const firstColor = colorSizeOptions[0];
    return (
      firstColor?.sizes?.find((size) => size.stock > 0)?.label ||
      firstColor?.sizes?.[0]?.label ||
      ""
    );
  });
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const activeColor = selectedColorOptions.includes(selectedColor)
    ? selectedColor
    : selectedColorOptions[0] || "";

  const selectedColorSizes = useMemo(() => {
    if (!activeColor) return [];
    const currentColor = colorSizeOptions.find(
      (item) => item.label.toLowerCase() === String(activeColor).toLowerCase(),
    );
    return currentColor?.sizes || [];
  }, [colorSizeOptions, activeColor]);

  const activeSize = selectedColorSizes.some(
    (size) => size.label.toLowerCase() === String(selectedSize).toLowerCase(),
  )
    ? selectedSize
    : selectedColorSizes.find((size) => size.stock > 0)?.label ||
      selectedColorSizes[0]?.label ||
      "";

  const selectedVariant = useMemo(() => {
    if (!product?.variants || !activeColor || !activeSize) return null;

    return (
      product.variants.find(
        (variant) =>
          String(variant.color || "").toLowerCase() ===
            String(activeColor).toLowerCase() &&
          String(variant.size || "").toLowerCase() ===
            String(activeSize).toLowerCase(),
      ) || null
    );
  }, [product, activeColor, activeSize]);

  const maxQuantity = selectedVariant?.stock
    ? Math.max(1, Number(selectedVariant.stock))
    : 0;

  const displayedQuantity = selectedVariant
    ? Math.min(Math.max(quantity, 1), maxQuantity)
    : 1;

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

  const handleQuantityChange = (nextValue) => {
    if (isCartDisabledForRole) return;
    if (!selectedVariant) return;
    const safeValue = Math.min(Math.max(nextValue, 1), maxQuantity);
    setQuantity(safeValue);
  };

  const handleColorSelect = (nextColor) => {
    setSelectedColor(nextColor);
    const nextColorEntry = colorSizeOptions.find(
      (entry) => entry.label.toLowerCase() === String(nextColor).toLowerCase(),
    );
    const preferredSize =
      nextColorEntry?.sizes?.find((size) => size.stock > 0)?.label ||
      nextColorEntry?.sizes?.[0]?.label ||
      "";
    setSelectedSize(preferredSize);
    setQuantity(1);
  };

  const handleSizeSelect = (nextSize) => {
    setSelectedSize(nextSize);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (isCartDisabledForRole) {
      toast.warning("Admin and editor accounts cannot add products to cart.");
      return;
    }

    if (!activeColor || !activeSize || !selectedVariant) {
      toast.error("Please select a valid color and size");
      return;
    }

    if (displayedQuantity < 1 || displayedQuantity > maxQuantity) {
      toast.error(`Quantity must be between 1 and ${maxQuantity}`);
      setQuantity(Math.min(Math.max(displayedQuantity, 1), maxQuantity));
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product._id,
        sku: selectedVariant.sku,
        quantity: displayedQuantity,
        product,
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <BreadCrumb items={breadcrumbItems} /> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mt-6 items-start">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={galleryImages[selectedImage]}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain rounded-xl"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <button
                aria-label="Save to wishlist"
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:text-rose-500 transition-all z-10 text-slate-700"
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-indigo-600 ring-2 ring-indigo-100 scale-[0.98]"
                        : "border-slate-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      fill
                      src={img}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <header>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ({product.rating || "4.9"} • 24 Reviews)
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
                {product.title}
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                ${product.price?.toLocaleString()}
              </p>
            </header>

            <p className="text-slate-600 leading-relaxed text-sm font-normal">
              {product.description}
            </p>

            <div className="h-px bg-slate-100 w-full" />

            {/* Color Swatches */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Color / Finish
              </label>
              <div className="flex flex-wrap gap-2.5">
                {selectedColorOptions.map((color, idx) => {
                  const currentColorEntry = colorSizeOptions.find(
                    (entry) =>
                      entry.label.toLowerCase() === String(color).toLowerCase(),
                  );
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold text-xs transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-100"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{color}</span>
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                        {currentColorEntry?.totalStock ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Select Size
              </label>
              <div className="flex gap-2.5 flex-wrap">
                {selectedColorSizes.map((size, idx) => {
                  const isSelected = selectedSize === size.label;
                  const isDisabled = size.stock <= 0 || isCartDisabledForRole;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        !isDisabled && handleSizeSelect(size.label)
                      }
                      disabled={isDisabled}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all uppercase ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : isDisabled
                            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {size.label}{" "}
                      <span className="ml-1 text-[10px] opacity-80">
                        ({size.stock})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-1 border border-slate-200 w-full sm:w-36">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(displayedQuantity - 1)}
                  disabled={
                    isCartDisabledForRole ||
                    !selectedVariant ||
                    displayedQuantity <= 1
                  }
                  className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-extrabold text-sm text-slate-900">
                  {displayedQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(displayedQuantity + 1)}
                  disabled={
                    isCartDisabledForRole ||
                    !selectedVariant ||
                    displayedQuantity >= maxQuantity
                  }
                  className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  isAddingToCart ||
                  isCartDisabledForRole ||
                  !selectedVariant ||
                  maxQuantity < 1
                }
                className={`flex-grow h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg ${
                  isCartDisabledForRole || !selectedVariant || maxQuantity < 1
                    ? "bg-gray-300 text-gray-500 shadow-none cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-900/10"
                } disabled:opacity-50`}
              >
                <ShoppingBag size={18} />
                <span>
                  {isCartDisabledForRole
                    ? "Cart Locked"
                    : !selectedVariant || maxQuantity < 1
                      ? "Out of Stock"
                      : isAddingToCart
                        ? "Adding to Cart..."
                        : "Add to Cart"}
                </span>
              </button>
            </div>

            {/* Value Propositions */}
            <footer className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100">
              <FeatureItem icon={<Truck size={16} />} label="Free Shipping" />
              <FeatureItem
                icon={<ShieldCheck size={16} />}
                label="Quality Guarantee"
              />
              <FeatureItem
                icon={<RotateCcw size={16} />}
                label="30-Day Returns"
              />
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
