"use client";

import React, { useState, useMemo } from "react";
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
import { toast } from "react-hot-toast";
import BreadCrumb from "@/app/components/commonUI/BreadCrumb";
import { addCartItem } from "@/app/lib/cartClient";
import { FeatureItem } from "@/app/components/main/shop/FeatureItem";

const ProductDetailClient = ({ product }) => {
  // Safe Image Array Extractor
  const galleryImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.thumbnail || "/placeholder-image.jpg"];
  }, [product]);

  // Safe Color Extractor (handles string arrays or variant object arrays)
  const availableColors = useMemo(() => {
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors;
    }
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const uniqueColors = [
        ...new Set(product.variants.map((v) => v.color).filter(Boolean)),
      ];
      if (uniqueColors.length > 0) return uniqueColors;
    }
    return ["Default"];
  }, [product]);

  // Safe Size Extractor
  const availableSizes = useMemo(() => {
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes;
    }
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const uniqueSizes = [
        ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
      ];
      if (uniqueSizes.length > 0) return uniqueSizes;
    }
    return ["Standard"];
  }, [product]);

  // Component States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const breadcrumbItems = [
    { name: "Shop", href: "/shop" },
    {
      name: product.category?.name || product.category || "Catalog",
      href: "/shop",
    },
    { name: product.title, href: "#" },
  ];

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size");
      return;
    }

    setIsAddingToCart(true);
    try {
      const colorVal =
        typeof selectedColor === "object"
          ? selectedColor.name || selectedColor.hex
          : selectedColor;
      const sizeVal =
        typeof selectedSize === "object" ? selectedSize.name : selectedSize;

      const cartItem = {
        id: `${product._id}-${colorVal}-${sizeVal}`,
        productId: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: galleryImages[0],
        color: colorVal,
        size: sizeVal,
        quantity: quantity,
      };

      await addCartItem(cartItem);
      toast.success("Added to cart!");
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
        <BreadCrumb items={breadcrumbItems} />

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
                    className="object-cover"
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
                {availableColors.map((color, idx) => {
                  const colorLabel =
                    typeof color === "object" ? color.name : color;
                  const hexCode =
                    typeof color === "object"
                      ? color.hex
                      : color.startsWith("#")
                        ? color
                        : null;
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold text-xs transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-100"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {hexCode && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: hexCode }}
                        />
                      )}
                      <span>{colorLabel}</span>
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
                {availableSizes.map((size, idx) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all uppercase ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-1 border border-slate-200 w-full sm:w-36">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-extrabold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-grow h-12 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.99] shadow-lg shadow-slate-900/10 disabled:opacity-50"
              >
                <ShoppingBag size={18} />
                <span>
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
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
