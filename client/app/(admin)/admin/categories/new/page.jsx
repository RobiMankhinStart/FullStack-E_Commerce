"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  RotateCcw,
  Image as ImageIcon,
  FolderPlus,
  Plus,
  Trash2,
  ArrowLeft,
  Tag,
} from "lucide-react";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import { generateSlug } from "@/app/lib/Utils";
import { toast } from "sonner";
import { useCreateNewCategoryMutation } from "@/app/(admin)/services/api";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [createNewCategory] = useCreateNewCategoryMutation();
  const router = useRouter();
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
    thumbnail: null,
  });
  console.log("category=", category);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategory((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleRemoveThumbnail = () => {
    setCategory((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleReset = () => {
    setCategory({
      name: "",
      slug: "",
      description: "",
      thumbnail: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // Constructing FormData for file & text payload
    const formData = new FormData();
    for (const item in category) {
      if (category[item] !== null && category[item] !== "") {
        formData.append(item, category[item]);
      }
    }

    // formData.append("name", category.name);
    // formData.append("slug", category.slug);
    // formData.append("description", category.description);
    // if (category.thumbnail) {
    //   formData.append("thumbnail", category.thumbnail);
    // }

    try {
      const res = await createNewCategory(formData).unwrap();

      toast.success(res?.message || "New category created successfully");
      console.log("cat6egory_success-response : ", res);
      setCategory({
        name: "",
        slug: "",
        description: "",
        thumbnail: null,
      });
      setTimeout(() => {
        router.push("/admin/categories");
      }, 2000);
    } catch (error) {
      const errMessage = error?.data?.message || "Something went wrong";
      toast.error(errMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Categories
        </Link>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Create New Category
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
          Add a new collection to organize product storefront hierarchies.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-3 px-4 sm:px-6 lg:px-8"
      >
        {/* Main Details Section */}
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <FolderPlus className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Category Details</h3>
            </div>

            <div className="grid gap-6">
              <Input
                label="Category Name"
                placeholder="e.g. Streetwear Collections"
                value={category.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory((prev) => ({
                    ...prev,
                    name: val,
                    slug: generateSlug(val),
                  }));
                }}
                className="rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
              />

              <Input
                label="Slug (Auto-generated)"
                value={category.slug}
                readOnly
                placeholder="streetwear-collections"
                className="cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 text-slate-500"
              />

              <Input
                as="textarea"
                rows={5}
                label="Description"
                placeholder="Describe what items belong to this category..."
                value={category.description}
                onChange={(e) =>
                  setCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
              />
            </div>
          </section>
        </div>

        {/* Media & Actions Side Panel */}
        <div className="space-y-8">
          {/* Thumbnail Section */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <ImageIcon className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Category Banner</h3>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thumbnail Image
              </label>

              {category.thumbnail ? (
                <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                  <Image
                    src={URL.createObjectURL(category.thumbnail)}
                    alt="Category Thumbnail Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveThumbnail}
                      className="bg-white text-rose-600 border-none hover:bg-rose-50"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-indigo-400 hover:bg-indigo-50/20">
                  <div className="rounded-full bg-white p-3 shadow-xs text-slate-400">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Upload Thumbnail
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="rounded-2xl py-3.5 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              leftIcon={<Save className="h-4 w-4" />}
            >
              Publish Category
            </Button>

            <Button
              type="reset"
              variant="ghost"
              fullWidth
              className="rounded-2xl py-3.5 text-slate-500 hover:bg-slate-100"
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset Form
            </Button>
          </section>
        </div>
      </form>
    </div>
  );
}
