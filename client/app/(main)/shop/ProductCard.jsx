"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
// import { addCartItem } from "@/app/lib/cartClient";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.variants || product.variants.length === 0) {
      toast.error("Product variants not available");
      return;
    }

    setIsAdding(true);
    try {
      const firstVariant = product.variants[0];
      const cartItem = {
        id: `${product._id}-${firstVariant.color}-${firstVariant.size}`,
        productId: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        color: firstVariant.color,
        size: firstVariant.size,
        sku: firstVariant.sku,
        quantity: 1,
      };

      //   await addCartItem(cartItem);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="flex flex-col h-full bg-white rounded-3xl p-3 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5">
        {/* Thumbnail Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image
            fill
            src={product.thumbnail || "/placeholder-image.jpg"}
            alt={product.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
            {product.tag ? (
              <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-sm border border-white/50">
                {product.tag}
              </span>
            ) : (
              <span />
            )}

            {product.rating && (
              <span className="bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-slate-700/50">
                <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white text-[11px] font-semibold">
                  {product.rating}
                </span>
              </span>
            )}
          </div>

          {/* Quick Add Floating Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            aria-label="Quick add to cart"
            className="absolute bottom-4 right-4 z-20 h-11 px-4 bg-white/95 backdrop-blur-md text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white disabled:opacity-50"
          >
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between flex-grow p-3 pt-4">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
                {product.title}
              </h3>
            </div>

            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4 font-normal">
              {product.description}
            </p>
          </div>

          {/* Footer Card Row: Color Swatches + Pricing */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
            {/* Color preview dots */}
            <div className="flex items-center gap-1.5">
              {product.colors?.slice(0, 3).map((hex, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-full border border-slate-200 shadow-inner"
                  style={{ backgroundColor: hex }}
                />
              ))}
              {product.colors?.length > 3 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ${product.originalPrice}
                </span>
              )}
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                ${product.price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
