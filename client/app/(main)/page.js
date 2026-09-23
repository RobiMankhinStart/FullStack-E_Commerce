export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "../components/main/HeroSlider";
import { apiClient } from "@/app/lib/apiClient";
import NewArrivalsSlider from "../components/main/NewArrivalsSlider";

const HomePage = async () => {
  const [categoryRes, productRes] = await Promise.all([
    apiClient.get("/category/all", { revalidate: 60 }),
    apiClient.get("/product/productlist?limit=5", { revalidate: 60 }),
  ]);

  const categories = categoryRes?.data || [];
  const products = productRes?.data?.productList || [];

  const editorialCards = [
    {
      title: "Soft Tailoring",
      subtitle: "Polished layers for everyday elegance.",
      image: "/coverpic5.jpg",
      accent: "from-rose-500/30 to-orange-500/20",
      badge: "New in",
      layout: "lg:col-span-2 lg:row-span-2 min-h-[500px]",
    },
    {
      title: "City Layers",
      subtitle: "Built for movement and late-night plans.",
      image: "/coverpic2.jpg",
      accent: "from-indigo-500/30 to-sky-500/20",
      badge: "Street edit",
      layout: "min-h-[240px]",
    },
    {
      title: "Weekend Uniform",
      subtitle: "Elevated basics for low-effort styling.",
      image: "/coverpic4.jfif",
      accent: "from-emerald-500/30 to-teal-500/20",
      badge: "Easy wear",
      layout: "min-h-[240px]",
    },
    {
      title: "New Neutrals",
      subtitle: "Minimal shades with a confident finish.",
      image: "/coverpic1.avif",
      accent: "from-slate-800/50 to-slate-500/15",
      badge: "Warm tones",
      layout: "lg:col-span-2 min-h-[260px]",
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900">
      <HeroSlider />

      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28rem] text-indigo-600">
              Shop by mood
            </span>
            <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Discover your next favorite fit
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Browse all collections
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {(categories.length > 0
            ? categories
            : [
                {
                  _id: "women",
                  name: "Women",
                  slug: "women",
                  description: "Light layers & elevated essentials",
                  thumbnail: "/coverpic6.jpg",
                },
                {
                  _id: "men",
                  name: "Men",
                  slug: "men",
                  description: "Clean silhouettes with everyday comfort",
                  thumbnail: "/coverpic7.jpg",
                },
                {
                  _id: "essentials",
                  name: "Essentials",
                  slug: "essentials",
                  description: "Wardrobe staples built for daily rotation",
                  thumbnail: "/coverpic8.jpg",
                },
                {
                  _id: "accessories",
                  name: "Accessories",
                  slug: "accessories",
                  description: "Finishing pieces that complete every look",
                  thumbnail: "/coverepic9.jpg",
                },
              ]
          ).map((category) => (
            <Link
              key={category._id}
              href={`/shop?category=${encodeURIComponent(category.slug || category.name.toLowerCase())}`}
              className="group relative overflow-hidden rounded-[28px] min-h-[340px] border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0">
                <Image
                  src={category.thumbnail || "/coverpic6.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-slate-500/10" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                <span className="mb-2 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24rem] backdrop-blur-sm">
                  {category.name}
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  {category.name}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-slate-200">
                  {category.description || "Fresh essentials for every day."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="curated-edits"
        className="px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-screen-2xl mx-auto w-full"
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28rem] text-indigo-600">
              Curated edits
            </span>
            <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Built for movement, comfort, and style
            </h2>
          </div>
          <p className="max-w-xl text-sm md:text-base text-slate-600">
            Thoughtful silhouettes, premium textures, and wardrobe pieces you
            can wear from morning coffee to late-night plans.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 auto-rows-[260px]">
          {editorialCards.map((card) => (
            <div
              key={card.title}
              className={`group relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm ${card.layout}`}
            >
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${card.accent}`}
                />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                <span className="mb-3 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24rem] text-white backdrop-blur-sm">
                  {card.badge}
                </span>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {card.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-slate-100">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-screen-2xl mx-auto w-full">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28rem] text-indigo-600">
              New arrivals
            </span>
            <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Fresh pieces for the season
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            View collection
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <NewArrivalsSlider products={products} />
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 max-w-screen-2xl mx-auto w-full">
        <div className="overflow-hidden rounded-[36px] bg-slate-900 text-white shadow-2xl shadow-slate-200/80">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="mb-4 inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28rem] text-slate-200">
                Join the list
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                Style notes <br /> for smarter shopping.
              </h2>
              <p className="mt-5 max-w-lg text-base md:text-lg text-slate-300">
                Subscribe for early access, curated drops, and exclusive offers
                on our latest collections.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-base text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-900 transition-colors hover:bg-indigo-100">
                  Subscribe now
                </button>
              </div>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[500px]">
              <Image
                src="/coverpic6.jpg"
                alt="Fashion editorial"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-950/70 via-slate-900/15 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
