"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Button from "../../components/commonUI/Button";
import { useCartStore } from "@/app/store/useCartStore";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem"; // Update import path if necessary

const CartDrawer = () => {
  const router = useRouter();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    isLoading,
    fetchCart,
    updateQuantity,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    if (isCartOpen) {
      fetchCart();
    }
  }, [isCartOpen, fetchCart]);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const totalItems = safeCartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  const subtotal = safeCartItems.reduce((sum, item) => {
    const price =
      item.subTotal ||
      (item.product?.price || item.price || 0) * (item.quantity || 1);
    return sum + price;
  }, 0);

  const handleStartShop = () => {
    closeCart();
    router.push("/shop");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <ShoppingBag className="text-indigo-600" size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Your Cart
                </h2>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors group cursor-pointer"
              >
                <X
                  size={20}
                  className="text-slate-400 group-hover:text-slate-900"
                />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Loader2 size={32} className="animate-spin text-indigo-600" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Loading cart...
                  </p>
                </div>
              ) : safeCartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={48} className="text-slate-200" />
                  <p className="text-slate-500 font-medium">
                    Your cart is empty.
                  </p>
                  <Button onClick={handleStartShop} variant="primary">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                safeCartItems.map((item) => (
                  <CartItem
                    key={item._id || item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                  />
                ))
              )}
            </div>

            {/* Footer / Checkout Area */}
            {safeCartItems.length > 0 && (
              <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center text-slate-600 mb-2">
                  <span className="text-sm font-semibold">Subtotal</span>
                  <span className="text-xl font-black text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Taxes and shipping calculated at checkout.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="ghost"
                    className="w-full bg-white border border-slate-200 hover:bg-slate-100! text-slate-900!"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                  <Link href="/checkout" onClick={closeCart} className="w-full">
                    <Button variant="primary" className="w-full group">
                      Checkout
                      <ArrowRight
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
