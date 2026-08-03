import Link from "next/link";

export function ProductNotFoundUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20">
      <div className="max-w-xl w-full rounded-3xl bg-white p-10 shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          The product you are looking for may have been removed, sold out, or
          the link is incorrect.
        </p>
        <Link
          href="/shop"
          className="inline-flex px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
