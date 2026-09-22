"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Plus, Upload, Loader2 } from "lucide-react";
import {
  useGetProductDetailsQuery,
  useGetCategoryListQuery,
  useUpdateProductMutation,
} from "../../../services/api";

const SIZE_OPTIONS = ["s", "m", "l", "xl", "xxl"];

export default function AdminProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;
  const router = useRouter();

  // Queries & Mutations
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductDetailsQuery(slug);

  const { data: categoryData } = useGetCategoryListQuery();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: 0,
    isActive: true,
  });

  const [variants, setVariants] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImgUrls, setDeleteImgUrls] = useState([]);

  // File uploads state
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newImagesPreviews, setNewImagesPreviews] = useState([]);

  // Populate data on load
  useEffect(() => {
    if (productData?.data) {
      const prod = productData.data;
      setFormData({
        title: prod.title || "",
        description: prod.description || "",
        category: prod.category?._id || prod.category || "",
        price: prod.price || "",
        discountPercentage: prod.discountPercentage || 0,
        isActive: prod.isActive ?? true,
      });

      setVariants(prod.variants || []);
      setExistingImages(prod.images || []);
    }
  }, [productData]);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Dynamic Variant handlers (Auto SKU appended)
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: `Ecom-${Math.floor(Math.random() * 10000)}`,
        color: "",
        size: "m",
        stock: 1,
      },
    ]);
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Thumbnail upload change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnail(file);
      setNewThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Gallery images change
  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalRemainingExisting = existingImages.length - deleteImgUrls.length;

    if (totalRemainingExisting + newImages.length + files.length > 4) {
      toast.error("Maximum total of 4 images allowed in gallery.");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Mark existing gallery image for deletion
  const toggleMarkDeleteExistingImage = (url) => {
    if (deleteImgUrls.includes(url)) {
      setDeleteImgUrls((prev) => prev.filter((item) => item !== url));
    } else {
      setDeleteImgUrls((prev) => [...prev, url]);
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.price) <= 100) {
      toast.error("Price is required and must be greater than 100.");
      return;
    }

    if (variants.length === 0) {
      toast.error("At least 1 product variant is required.");
      return;
    }

    for (const v of variants) {
      if (!v.sku || !v.color || !v.size || v.stock < 1) {
        toast.error(
          "All variants must have valid SKU, Color, Size, and minimum stock of 1.",
        );
        return;
      }
    }

    const totalImagesCount =
      existingImages.length - deleteImgUrls.length + newImages.length;

    if (totalImagesCount < 1) {
      toast.error("Minimum 1 product image is required.");
      return;
    }

    if (totalImagesCount > 4) {
      toast.error("Maximum 4 product images allowed.");
      return;
    }

    // Build FormData
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("price", formData.price);
    payload.append("discountPercentage", formData.discountPercentage);
    payload.append("isActive", formData.isActive);

    // Variants JSON
    payload.append("variants", JSON.stringify(variants));

    // Delete image URLs array
    if (deleteImgUrls.length > 0) {
      payload.append("deleteImgUrls", JSON.stringify(deleteImgUrls));
    }

    // Files
    if (newThumbnail) {
      payload.append("thumbnail", newThumbnail);
    }

    newImages.forEach((img) => {
      payload.append("images", img);
    });

    try {
      const res = await updateProduct({ slug, formData: payload }).unwrap();

      // Success toast from backend
      toast.success(res?.message || "Product updated successfully!");

      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);

      // Error toast from backend
      toast.error(
        err?.data?.message || err?.message || "Failed to update product.",
      );
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (productError || !productData?.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">Failed to load product details.</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  const rawCategories =
    categoryData?.data?.categories || categoryData?.data || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Product Editor
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              {productData.data.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              formData.isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {formData.isActive ? "Active" : "Draft"}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* General Info Card */}
            <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select Category</option>
                    {rawCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Product Active / Visible
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="101"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">Min. price 101</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Variants Section */}
            <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Product Variants
                  </h2>
                  <p className="text-xs text-slate-500">
                    At least 1 variant required. Unique SKU per variant.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl"
                >
                  <Plus size={16} /> Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                  >
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                        placeholder="SKU-123"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white"
                        required
                      />
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">
                        Color
                      </label>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        placeholder="Red"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white"
                        required
                      />
                    </div>

                    <div className="w-24">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">
                        Size
                      </label>
                      <select
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(index, "size", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white"
                      >
                        {SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "stock",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="mt-4 p-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            {/* Thumbnail Card */}
            <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Thumbnail
              </h2>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 h-48 w-full flex items-center justify-center">
                {newThumbnailPreview || productData.data.thumbnail ? (
                  <Image
                    src={newThumbnailPreview || productData.data.thumbnail}
                    alt="Thumbnail preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-slate-400" />
                )}
              </div>

              <label className="block">
                <span className="sr-only">Choose thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </label>
            </div>

            {/* Gallery Images Card */}
            <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Gallery Images
                </h2>
                <span className="text-xs text-slate-400">Max 4 total</span>
              </div>

              {/* Existing Images */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Existing
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {existingImages.map((url, idx) => {
                    const isMarked = deleteImgUrls.includes(url);
                    return (
                      <div
                        key={idx}
                        className={`relative h-24 overflow-hidden rounded-xl border ${
                          isMarked
                            ? "border-red-500 opacity-40"
                            : "border-slate-200"
                        }`}
                      >
                        <Image
                          src={url}
                          alt="Gallery item"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleMarkDeleteExistingImage(url)}
                          className={`absolute top-1 right-1 rounded-lg p-1 text-white shadow ${
                            isMarked
                              ? "bg-emerald-600"
                              : "bg-red-600/80 hover:bg-red-600"
                          }`}
                        >
                          {isMarked ? <Plus size={14} /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* New Image Upload previews */}
              {newImagesPreviews.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    To Upload
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {newImagesPreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative h-24 overflow-hidden rounded-xl border border-indigo-200"
                      >
                        <Image
                          src={src}
                          alt="New preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-1 right-1 rounded-lg bg-slate-900/70 p-1 text-white hover:bg-slate-900"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New File Input */}
              <label className="block pt-2">
                <span className="sr-only">Add gallery images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImagesChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </label>
            </div>

            {/* Save Action */}
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Updating...
                </>
              ) : (
                "Save Product Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
