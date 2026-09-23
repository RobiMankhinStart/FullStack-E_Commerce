"use client";

import React from "react";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const title = item.title || item.product?.title || "Product";
  const price = item.product?.price || item.price || 0;
  const totalSingleProductPrice = item.subTotal || price * item.quantity;
  const image = item.product?.thumbnail || item.thumbnail || "";
  const itemId = item._id || item.id;
  const productId = item.product?._id || item.product;
  const qty = item.quantity || 1;

  return (
    <div className="flex gap-4 group">
      {/* Item Image */}
      <div className="relative p-10 w-16 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
            IMG
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
            {title}
          </h3>
          <button
            onClick={() => onRemoveItem(itemId)}
            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-sm font-black text-indigo-600 mt-1">
          ${Number(totalSingleProductPrice).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="mt-auto flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-full p-1">
            <button
              onClick={() =>
                qty > 1 && onUpdateQuantity(productId, itemId, qty - 1)
              }
              disabled={qty <= 1}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus size={12} strokeWidth={3} />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900">
              {qty}
            </span>
            <button
              onClick={() => onUpdateQuantity(productId, itemId, qty + 1)}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Plus size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
