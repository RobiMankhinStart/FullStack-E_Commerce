"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Button from "@/app/components/commonUI/Button";
import { useCartStore } from "@/app/store/useCartStore";

export default function SuccessPage() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear local cart store after successful payment redirection
    clearCart();
    const timer = setTimeout(() => {
      useCartStore.getState().fetchCart();
    }, 1500);
    return () => clearTimeout(timer);
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-6">
        {/* Animated / Colored Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Thank you for your purchase. We have received your payment and are
            processing your order.
          </p>
        </div>

        {/* Divider & Order Note */}
        <div className="border-t border-slate-100 pt-6 text-xs text-slate-400">
          A confirmation email will be sent shortly with your shipment tracking
          details.
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={() => router.push("/shop")}
            variant="primary"
            className="w-full hover:cursor-pointer py-3.5 font-bold"
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </div>
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full py-3.5 hover:cursor-pointer font-semibold text-slate-600 border-slate-200"
          >
            <div className="flex items-center gap-2 w-full">
              <span>Back to Home</span>
              <ArrowRight size={16} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
