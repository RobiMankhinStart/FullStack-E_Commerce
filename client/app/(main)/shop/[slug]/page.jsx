export const dynamic = "force-dynamic";

import { apiClient } from "@/app/lib/apiClient";
import BreadCrumb from "@/app/components/commonUI/BreadCrumb";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

// Generating Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  console.log("Fetching slug:", slug);
  try {
    const res = await apiClient.get(`/product/${slug}`);
    console.log("product", res);
    const product = res?.data || res?.data?.productDetails;

    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.title} | Shop`,
      description: product.description?.substring(0, 160),
    };
  } catch {
    return { title: "Product Details" };
  }
}

const ProductDetailPage = async ({ params }) => {
  // Next.js 15+ async params unwrapping
  const { slug } = await params;

  let product = null;

  try {
    const res = await apiClient.get(`/product/${slug}`, {
      revalidate: 60,
    });
    // Adjust key extraction based on your backend sendResponse standard
    product = res?.data?.data || res?.data || null;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
  }

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Shop", href: "/shop" },
    { name: product.title, href: `/shop/${slug}` },
  ];

  return (
    <div className="bg-slate-50/60 text-slate-900 font-sans min-h-screen antialiased">
      <main className="pt-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadCrumb items={breadcrumbItems} />
        <ProductDetailClient product={product} />
      </main>
    </div>
  );
};

export default ProductDetailPage;
