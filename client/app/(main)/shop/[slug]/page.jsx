// export const dynamic = "force-dynamic";

// import React from "react";
// import { apiClient } from "@/app/lib/apiClient";
// import ProductDetailClient from "./ProductDetailClient";
// import { ProductNotFoundUI } from "@/app/components/main/shop/ProductNotFoundUI";

// const ProductDetailPage = async ({ params }) => {
//   // Await params explicitly for Next.js 15 compatibility
//   const resolvedParams = await params;
//   const currentSlug = resolvedParams?.slug;

//   if (!currentSlug) {
//     return <ProductNotFoundUI />;
//   }

//   try {
//     // Request product detail endpoint by slug
//     const response = await apiClient.get(
//       `/product/${currentSlug.toLowerCase()}`,
//       {
//         revalidate: 300, // Revalidate cache every 5 minutes
//       },
//     );

//     const product = response?.data || null;

//     if (!product) {
//       // eslint-disable-next-line react-hooks/error-boundaries
//       return <ProductNotFoundUI />;
//     }

//     // eslint-disable-next-line react-hooks/error-boundaries
//     return <ProductDetailClient product={product} />;
//   } catch (error) {
//     console.error("Failed to fetch product details:", error);
//     return <ProductNotFoundUI />;
//   }
// };

// // Fallback UI for missing or un-fetched items

// export default ProductDetailPage;
