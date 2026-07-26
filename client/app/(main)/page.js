export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import Button from "../components/commonUI/Button";
import Link from "next/link";
import HeroSlider from "../components/main/HeroSlider";
// import { apiClient } from "@/app/lib/apiClient";

const HomePage = async () => {
  // const productResponse = await apiClient.get("/product/allproducts?limit=5", {
  //   revalidate: 60 * 5,
  // });
  // const products = productResponse?.data?.products || [];

  return (
    <>
      {/* Hero Section */}
      <HeroSlider />

      {/* Shop by Intent / Categories */}
      <section className="px-8 mt-4 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
              Categories
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Shop by Intent
            </h2>
          </div>
          {/* <button className="text-sm font-bold flex items-center gap-2 hover:text-indigo-600 transition-colors">
            All Categories <span>→</span>
          </button> */}
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<span>→</span>}
            className="font-bold hover:text-indigo-600 hover:bg-transparent"
          >
            All Categories
          </Button>
        </div>

        {/* MAIN parent container controls the structural bounding box heights safely */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[500px] lg:h-[600px]">
          {/* Living Card (Left Side) - Takes half the grid width */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-slate-900 min-h-[350px] md:min-h-full">
            <Image
              fill
              priority
              src="https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200"
              alt="Living"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
              <h3 className="text-3xl font-bold text-white mb-2">Living</h3>
              <p className="text-slate-200 text-sm max-w-xs">
                Elevated environments for daily rituals.
              </p>
            </div>
          </div>

          {/* Right Side Complex Grid - Fixed to use a flexible flex column layout to avoid row collapses */}
          <div className="md:col-span-2 flex flex-col gap-4 h-full min-h-[500px] md:min-h-0">
            {/* Apparel Card (Top half) */}
            <div className="flex-1 relative group overflow-hidden rounded-2xl bg-orange-100 min-h-[200px] md:min-h-0">
              <Image
                fill
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200"
                alt="Apparel"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <h3 className="text-2xl font-bold text-slate-900">Apparel</h3>
              </div>
            </div>

            {/* Objects & Footwear Split Grid (Bottom half) */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-[200px] md:min-h-0">
              {/* Objects Card */}
              <div className="relative group overflow-hidden rounded-2xl bg-slate-100 h-full">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=600"
                  alt="Objects"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <h3 className="text-xl font-bold text-slate-900">Objects</h3>
                </div>
              </div>

              {/* Footwear Card */}
              <div className="relative group overflow-hidden rounded-2xl bg-slate-200 h-full">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600"
                  alt="Footwear"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <h3 className="text-xl font-bold text-slate-900">Footwear</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-8 max-w-screen-2xl mx-auto mt-2 w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            New Arrivals
          </h2>
          <div className="flex gap-2">
            <button className="p-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
              ←
            </button>
            <button className="p-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {/* {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${product.slug}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-2xl bg-slate-100 overflow-hidden mb-4 relative">
                  <Image
                    fill
                    src={product.thumbnail || "/placeholder-image.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">
                    {product.tags?.[0] || "New"}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.description?.slice(0, 70) ||
                        "Modern essentials for elevated living."}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${product.price?.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-3xl bg-white p-12 shadow-sm border border-slate-200 text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                No new arrivals found
              </h3>
              <p className="text-slate-500">
                Check back soon for the latest curated pieces.
              </p>
            </div>
          )} */}
        </div>
      </section>

      {/* Editorial / CTA */}
      <section className="px-8 max-w-screen-2xl mx-auto w-full">
        <div className="bg-indigo-600 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
          <div className="flex-1 p-16 flex flex-col justify-center">
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">
              Summer Editorial
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              The Art of <br /> Living Well
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-lg">
              Join our newsletter for early access to the upcoming capsule
              collection and exclusive editorial content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 ring-white/30"
              />
              <button className="w-full sm:w-auto bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
