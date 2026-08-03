export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import BreadCrumb from "@/app/components/commonUI/BreadCrumb";
import ProductCard from "./ProductCard";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/app/lib/mockData";

const ShopPage = async ({ searchParams }) => {
  const breadcrumbItems = [{ name: "Shop", href: "/shop" }];

  // 1. Next.js 15+ Async searchParams unwrapping
  const resolvedSearchParams = await searchParams;

  const search = Array.isArray(resolvedSearchParams?.search)
    ? resolvedSearchParams.search[0]
    : resolvedSearchParams?.search || "";

  const category = Array.isArray(resolvedSearchParams?.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams?.category || "";

  const page =
    parseInt(
      Array.isArray(resolvedSearchParams?.page)
        ? resolvedSearchParams.page[0]
        : resolvedSearchParams?.page,
      10,
    ) || 1;

  // 2. Local mock filtering (Replaces backend API during dev stage)
  const categories = MOCK_CATEGORIES;

  let filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory = category ? prod.category === category : true;
    const matchesSearch = search
      ? prod.title.toLowerCase().includes(search.toLowerCase()) ||
        prod.description.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / 6) || 1;
  const products = filteredProducts;

  return (
    <div className="bg-slate-50/60 text-slate-900 font-sans min-h-screen antialiased">
      <main className="pt-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadCrumb items={breadcrumbItems} />

        {/* Hero Header Banner */}
        <header className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 mb-12 shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-semibold text-xs tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Curated Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Modern Essentials & Design Objects
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Discover crafted apparel, minimal gear, and everyday luxury
              objects designed for form and function.
            </p>
          </div>
        </header>

        {/* Filter Controls Row & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Form */}
          <form
            method="get"
            className="relative flex-grow max-w-md flex items-center"
          >
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search products..."
              className="w-full pl-11 pr-24 h-12 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 h-9 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Quick Clear / Filter Status */}
          <div className="flex items-center gap-3">
            {(search || category) && (
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-slate-200/70 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reset Filters
              </Link>
            )}
            <span className="text-xs text-slate-500 font-medium px-1">
              Showing{" "}
              <strong className="text-slate-900">{products.length}</strong>{" "}
              items
            </span>
          </div>
        </div>

        {/* Mobile Horizontal Category Pills */}
        <div className="mb-8 md:hidden overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2">
            <Link
              href={
                search ? `/shop?search=${encodeURIComponent(search)}` : "/shop"
              }
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !category
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Items
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?${new URLSearchParams({
                  ...(search ? { search } : {}),
                  category: cat.slug,
                }).toString()}`}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  category === cat.slug
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-28 space-y-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-4">
                  Categories
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href={
                        search
                          ? `/shop?search=${encodeURIComponent(search)}`
                          : "/shop"
                      }
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        !category
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-normal">
                        {MOCK_PRODUCTS.length}
                      </span>
                    </Link>
                  </li>
                  {categories.map((cat) => {
                    const isActive = category === cat.slug;
                    return (
                      <li key={cat._id}>
                        <Link
                          href={`/shop?${new URLSearchParams({
                            ...(search ? { search } : {}),
                            category: cat.slug,
                          }).toString()}`}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-normal">
                            {cat.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-4">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 right-1/3 bg-indigo-600 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>$0</span>
                    <span>$500+</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-grow">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-12">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                  No products found
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  We couldn't find anything matching your filters. Try adjusting
                  your search term or clearing filters.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex h-10 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(search ? { search } : {}),
                      ...(category ? { category } : {}),
                      page: String(Math.max(1, page - 1)),
                    }).toString()}`}
                    className={`w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center transition-all ${
                      page <= 1
                        ? "text-slate-300 pointer-events-none border-slate-100"
                        : "text-slate-600 hover:border-indigo-600 hover:text-indigo-600 shadow-sm"
                    }`}
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Link>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const num = idx + 1;
                    return (
                      <Link
                        key={num}
                        href={`/shop?${new URLSearchParams({
                          ...(search ? { search } : {}),
                          ...(category ? { category } : {}),
                          page: String(num),
                        }).toString()}`}
                        className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                          num === page
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600"
                        }`}
                      >
                        {num}
                      </Link>
                    );
                  })}

                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(search ? { search } : {}),
                      ...(category ? { category } : {}),
                      page: String(Math.min(totalPages, page + 1)),
                    }).toString()}`}
                    className={`w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center transition-all ${
                      page >= totalPages
                        ? "text-slate-300 pointer-events-none border-slate-100"
                        : "text-slate-600 hover:border-indigo-600 hover:text-indigo-600 shadow-sm"
                    }`}
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Page {page} of {totalPages}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;
