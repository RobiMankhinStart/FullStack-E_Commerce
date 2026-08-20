"use client";

import {
  Save,
  RotateCcw,
  Image as ImageIcon,
  Box,
  Tag,
  Plus,
  Trash2,
  Delete,
  DeleteIcon,
  Layers,
  Percent,
  DollarSign,
  MessageCircleX,
} from "lucide-react";

import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import { useState } from "react";
import Image from "next/image";

export default function CreateProductPage() {
  const clampNonNegativeNumber = (val) => {
    if (val === "" || val === undefined || val === null) return "";
    const strVal = String(val).trim();
    if (strVal.includes("-") || Number(strVal) < 0) {
      return "0";
    }
    return strVal;
  };

  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: "",
    variants: [],
    tags: "",
    thumbnail: "",
    images: [],
  });
  console.log("newProduct=", newProduct);
  const [variantState, setVariantState] = useState([
    {
      id: crypto.randomUUID(),
      // eslint-disable-next-line react-hooks/purity
      sku: `Ecom-${Math.floor(Math.random() * 10000)}`,
      color: "",
      size: "",
      stock: "",
    },
  ]);
  console.log("variantState=", variantState);
  const AddNewVarient = () => {
    const newVariant = {
      id: crypto.randomUUID(),
      sku: `Ecom-${Math.floor(Math.random() * 10000)}`,
      color: "",
      size: "",
      stock: "",
    };
    const nextVariants = [...variantState, newVariant];

    setVariantState(nextVariants);
    setNewProduct((prev) => ({ ...prev, variants: nextVariants }));
  };

  const deleteVarient = (id) => {
    if (variantState.length > 1) {
      const nextVariants = variantState.filter((variant) => variant.id !== id);

      setVariantState(nextVariants);
      setNewProduct((prev) => ({ ...prev, variants: nextVariants }));
    }
  };

  const varientInputChange = (id, field, value) => {
    const nextVariants = variantState.map((variant) =>
      variant.id === id ? { ...variant, [field]: value } : variant,
    );

    setVariantState(nextVariants);
    setNewProduct((prev) => ({ ...prev, variants: nextVariants }));
    // alternative of just variantState state update
    // setVarients((prev) => {
    //   prev.map((vitem) => {
    //     if (vitem.id == id) {
    //       return { ...vitem, [field]: value };
    //     }
    //     return vitem;
    //   });
    // });

    // alternative
    // let changedvarient = varients.map((vitem) => {
    //   if (vitem.id == id) {
    //     vitem[field] = value;
    //   }
    //   return vitem;
    // });
    // setVarients(changedvarient);
  };

  const handleImagesChange = (e) => {
    const files = e.target.files[0];
    const changedImages = [...newProduct.images];
    changedImages.push(files);
    setNewProduct((prev) => ({ ...prev, images: changedImages }));
  };

  // delete images
  const handleImageDelete = (i) => {
    const updatedImages = newProduct.images.filter((_, index) => index !== i);
    setNewProduct((prev) => ({ ...prev, images: updatedImages }));
  };
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8 ">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900">
          Create New Product
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-medium text-slate-500">
          Fill in the details below to add a new item to your store.
        </p>
      </div>

      <form className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <Layers className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Product Information</h3>
            </div>

            <div className="grid gap-6">
              <Input
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, title: e.target.value }))
                }
                value={newProduct.title}
                label="Product Title"
                placeholder="e.g. Premium Cotton Hoodie"
                className="rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
              />

              <Input
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, slug: e.target.value }))
                }
                value={newProduct.slug}
                label="Slug (Auto-generated)"
                readOnly
                placeholder="premium-cotton-hoodie"
                className="cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 text-slate-500"
              />

              <Input
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                value={newProduct.description}
                label="Description"
                as="textarea"
                rows={5}
                placeholder="Tell customers about this product's features and materials..."
                className="rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <Box className="h-5 w-5" />
                <h3 className="font-bold tracking-tight">
                  Inventory & Variants
                </h3>
              </div>
              <Button
                onClick={AddNewVarient}
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-lg bg-slate-900 text-white hover:bg-indigo-600"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Variant
              </Button>
            </div>

            {/* Variant list  */}
            <div className="space-y-4">
              {variantState.map((variant, i) => (
                <div
                  key={variant.id}
                  className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-5 md:items-end"
                >
                  <Input
                    onChange={(e) =>
                      varientInputChange(variant.id, "sku", e.target.value)
                    }
                    value={variant.sku}
                    label="SKU"
                    labelClassName="text-[10px] font-bold uppercase text-slate-400"
                    containerClassName="space-y-1.5"
                    placeholder="NM-10293"
                    className="rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-indigo-500"
                  />

                  <Input
                    onChange={(e) =>
                      varientInputChange(variant.id, "color", e.target.value)
                    }
                    value={variant.color}
                    label="Color"
                    labelClassName="text-[10px] font-bold uppercase text-slate-400"
                    containerClassName="space-y-1.5"
                    placeholder="Black"
                    className="rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-indigo-500"
                  />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Size
                    </label>
                    <select
                      onChange={(e) =>
                        varientInputChange(variant.id, "size", e.target.value)
                      }
                      value={variant.size}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                    >
                      <option value="">Size</option>
                      {["xs", "s", "m", "l", "xl", "2xl"].map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    onChange={(e) =>
                      varientInputChange(
                        variant.id,
                        "stock",
                        clampNonNegativeNumber(e.target.value),
                      )
                    }
                    value={variant.stock}
                    label="Stock"
                    labelClassName="text-[10px] font-bold uppercase text-slate-400"
                    containerClassName="space-y-1.5"
                    type="number"
                    min={0}
                    placeholder="10"
                    className="rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-indigo-500"
                  />

                  <div className="flex justify-end">
                    {variantState.length > 1 && (
                      <Button
                        onClick={() => deleteVarient(variant.id)}
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg bg-white text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8 ">
          <section className=" rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-indigo-600">
              <ImageIcon className="h-5 w-5" />
              <h3 className="font-bold tracking-tight">Product Media</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="space-y-2 ">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Main Thumbnail
                  </label>
                  <div className="relative w-48 aspect-square  overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-indigo-400">
                    <label className="flex h-full w-full  cursor-pointer flex-col items-center justify-center gap-2">
                      <Plus className="h-6 w-6 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400">
                        UPLOAD THUMBNAIL
                      </span>
                      <Input
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            thumbnail: e.target.files[0],
                          }))
                        }
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  {newProduct.thumbnail && (
                    <Image
                      width={200}
                      height={200}
                      src={URL.createObjectURL(newProduct.thumbnail)}
                      alt="thumbnail"
                    />
                  )}
                </div>
              </div>
              <div className="">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Gallery Images
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100">
                      <Plus className="h-6 w-6 text-slate-300" />
                      <span className="text-center text-[10px] font-bold text-slate-400">
                        Upload Images
                      </span>
                      <Input
                        onChange={handleImagesChange}
                        type="file"
                        multiple
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4 items-center ">
                  {newProduct.images.length > 0 &&
                    newProduct.images.map((image, i) => {
                      const imageUrl =
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image);
                      return (
                        <div
                          // key={i}
                          key={image.name ? `${image.name}-${i}` : i}
                          className="border border-fuchsia-100 relative"
                        >
                          <Button
                            onClick={() => handleImageDelete(i)}
                            className="cursor-pointer absolute  -right-4 -top-5 hover:text-rose-800!  "
                            size="xs"
                            // rounded="xs"
                            variant="ghost"
                          >
                            <MessageCircleX />
                          </Button>
                          <Image
                            width={100}
                            height={50}
                            src={imageUrl}
                            alt={`upload-preview-${i}`}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>

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
              <Input
                label="Price"
                value={newProduct.price}
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                onChange={(e) => {
                  setNewProduct((prev) => ({
                    ...prev,
                    price: clampNonNegativeNumber(e.target.value),
                  }));
                }}
                leftIcon={<DollarSign className="h-3.5 w-3.5" />}
                className="rounded-xl border-slate-200 bg-slate-50 pl-10 focus:border-indigo-500 focus:bg-white"
              />

              <Input
                onChange={(e) => {
                  setNewProduct((prev) => ({
                    ...prev,
                    discountPercentage: clampNonNegativeNumber(e.target.value),
                  }));
                }}
                value={newProduct.discountPercentage}
                label="Discount"
                type="number"
                min={0}
                step="1"
                placeholder="0"
                leftIcon={<Percent className="h-3.5 w-3.5" />}
                className="rounded-xl border-slate-200 bg-slate-50 pl-10 focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <Input
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, tags: e.target.value }))
              }
              value={newProduct.tags}
              label="Tags"
              placeholder="streetwear, summer, sale"
              leftIcon={<Tag className="h-3.5 w-3.5" />}
              className="rounded-xl border-slate-200 bg-slate-50 pl-10 focus:border-indigo-500 focus:bg-white"
            />

            <Button
              type="reset"
              variant="ghost"
              fullWidth
              className="rounded-2xl py-4 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="rounded-2xl py-4 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              leftIcon={<Save className="h-4 w-4" />}
            >
              Publish Product
            </Button>
          </section>
        </div>
      </form>
    </div>
  );
}
