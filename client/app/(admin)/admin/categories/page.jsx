"use client";

import { FiTag } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { useGetCategoryListQuery } from "../../services/api";
import Image from "next/image";

export default function CategoriesPage() {
  const { data } = useGetCategoryListQuery();
  console.log("category-data:", data);
  const categories = data?.data || [];
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
              Categories
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Organize your storefront
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create a clear hierarchy for merchandise and collections.
            </p>
          </div>
          <Button variant="primary">New category</Button>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <Image
              src={category.thumbnail}
              alt={category.title}
              width={800}
              height={480}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-48 w-full object-cover"
            />
            <div className="flex mt-2 items-center justify-between">
              <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-700">
                <FiTag size={16} />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                {category.count} items
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-slate-500">Slug: {category.slug}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
