"use client";

import { FiTag, FiFolder } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { useGetCategoryListQuery } from "../../services/api";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoryListQuery();
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

          <Link href="/admin/categories/new">
            <Button variant="primary">New category</Button>
          </Link>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const categoryName = category.name || "Category";
          const thumbnailUrl = category.thumbnail?.trim();

          return (
            <div
              key={category._id}
              className="flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              {/* Safe Image Handling */}
              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt={categoryName}
                    width={800}
                    height={480}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                    <FiFolder size={36} />
                    <span className="mt-2 text-xs">No Thumbnail</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-700">
                  <FiTag size={16} />
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                  {category.count ?? 0} items
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {categoryName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Slug: {category.slug || "n/a"}
              </p>

              <div className="mt-auto pt-5 flex flex-wrap gap-2">
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
          );
        })}
      </div>
    </div>
  );
}
