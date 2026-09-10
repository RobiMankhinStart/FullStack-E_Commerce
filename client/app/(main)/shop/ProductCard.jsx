import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const originalPrice = product.price || 0;
  const discount = product.discountPercentage || 0;
  const discountedPrice =
    discount > 0
      ? Math.round(originalPrice - (originalPrice * discount) / 100)
      : originalPrice;

  // Handle tags mapping securely from array or comma-separated strings
  const tagsList = product.tags
    ? product.tags
        .flatMap((t) => (typeof t === "string" ? t.split(",") : t))
        .map((s) => s?.trim())
        .filter(Boolean)
    : [];

  return (
    <article className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col justify-between group">
      <div>
        {/* Image Container matching your previous card structure */}
        <div className="relative border h-48 w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.thumbnail || product.image || "/placeholder.jpg"}
            alt={product.title || product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Percentage Badge */}
          {discount > 0 && (
            <span className="absolute border top-1 left-2.5 bg-rose-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
              -{discount}%
            </span>
          )}

          {/* Category Badge */}
          {/* {product.category?.name && (
            <span className="absolute top-1 left-[74%] bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-medium px-2.5 py-0.5 rounded shadow-sm">
              {product.category.name}
            </span>
          )} */}
        </div>

        {/* Tags Pills */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tagsList.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title (Supports both title and name properties) */}
        <h2 className="font-semibold text-lg text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
          {product.title || product.name}
        </h2>

        {/* Description Preview */}
        {product.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        )}
      </div>

      {/* Pricing & Action Section */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-indigo-600">
            ৳{discountedPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ৳{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
