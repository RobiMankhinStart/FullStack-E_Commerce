"use client";
import Link from "next/link";

import Image from "next/image";
import { FiStar } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { MOCK_PRODUCTS } from "@/app/lib/mockData";
import { useGetProductListQuery } from "../../services/api";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const { data, isLoading, error } = useGetProductListQuery();
  console.log("productData : ", data?.data?.productList);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
              Products
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Curate your catalog
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Showcase your best offers with a polished product experience.
            </p>
          </div>
          {/* <Button variant="primary">Add product</Button> */}
          <Link
            href="/admin/products/new"
            className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>
      </section>
      {isLoading ? (
        <p className="p-4 text-slate-500">Loading.......</p>
      ) : error ? (
        <p className="p-4 text-red-500">Error fetching data</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {data?.data?.productList.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
            >
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={800}
                height={480}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-indigo-700">
                    {product.tag || "Featured"}
                  </span>

                  {product.rating ? (
                    <div className="flex items-center gap-1 text-amber-500">
                      <FiStar />
                      <span className="text-sm text-slate-600">
                        {product.rating}
                      </span>
                    </div>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">
                      ${product.price}
                    </p>
                    {product.originalPrice ? (
                      <p className="text-sm text-slate-400 line-through">
                        ${product.originalPrice}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
