"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef } from "react";

const NewArrivalsSlider = ({ products = [] }) => {
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  if (!products.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        New arrivals will appear here soon.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollSlider(-1)}
          aria-label="Scroll left"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollSlider(1)}
          aria-label="Scroll right"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => {
          const imageUrl =
            product.thumbnail || product.images?.[0] || "/coverpic6.jpg";
          const categoryName =
            product.category?.name || product.category || "Featured";
          const tag = product.tags?.[0] || "New";
          const rating = product.rating || 4.8;

          return (
            <Link
              key={product._id}
              href={`/shop/${product.slug}`}
              className="group min-w-[260px] max-w-[280px] snap-start rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-slate-100">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2rem] text-slate-700 backdrop-blur-sm">
                  {tag}
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-slate-950/75 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {categoryName}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-indigo-600">
                    {product.title}
                  </h3>
                  <span className="text-base font-black text-slate-900">
                    ${Number(product.price || 0).toLocaleString()}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-slate-500">
                  {product.description ||
                    "Premium everyday essentials with a refined finish."}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs font-bold text-slate-700">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2rem] text-slate-600">
                    {product.variants?.length || 1} variants
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NewArrivalsSlider;
