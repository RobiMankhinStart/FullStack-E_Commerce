"use client";

import React from "react";
import {
  Save,
  X,
  Image as ImageIcon,
  Box,
  Tag,
  Plus,
  Trash2,
  Layers,
  Percent,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
// import AdminPageHeader from "@/app/components/admin/adminPageHeader";

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8 ">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900">
          Create New Product
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mt-3">
          Fill in the details below to add a new item to your store.
        </p>
      </div>

      <form className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: General Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <Layers className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Product Information</h3>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Product Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Premium Cotton Hoodie"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Slug (Auto-generated)
                </label>
                <input
                  readOnly
                  type="text"
                  placeholder="premium-cotton-hoodie"
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell customers about this product's features and materials..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                />
              </div>
            </div>
          </section>

          {/* Section: Variants & Inventory */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <Box className="h-5 w-5" />
                <h3 className="font-bold tracking-tight">
                  Inventory & Variants
                </h3>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-600"
              >
                <Plus className="h-3.5 w-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {/* Sample Static Variant Row */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-5 md:items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    SKU
                  </label>
                  <input
                    type="text"
                    placeholder="NM-10293"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Color
                  </label>
                  <input
                    type="text"
                    placeholder="Black"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Size
                  </label>
                  <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500">
                    <option value="">Size</option>
                    {["xs", "s", "m", "l", "xl", "2xl", "3xl"].map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-rose-500 shadow-sm transition-colors hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Media & Pricing */}
        <div className="space-y-8">
          {/* Section: Media Uploads */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <ImageIcon className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Product Media</h3>
            </div>

            <div className="space-y-6">
              {/* Thumbnail Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Main Thumbnail
                </label>
                <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-indigo-400">
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
                    <Plus className="h-6 w-6 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400">
                      UPLOAD THUMBNAIL
                    </span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Gallery Images Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Gallery Images
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <Plus className="h-5 w-5 text-slate-300" />
                    <input type="file" multiple className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Category & Pricing */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white">
                <option value="">Select Category</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <DollarSign className="h-3.5 w-3.5" /> Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <Percent className="h-3.5 w-3.5" /> Discount
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Tag className="h-3.5 w-3.5" /> Tags
              </label>
              <input
                type="text"
                placeholder="streetwear, summer, sale"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              Publish Product
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}
