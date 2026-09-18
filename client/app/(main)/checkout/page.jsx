"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Input from "@/app/components/commonUI/Input";
import { useCartStore } from "@/app/store/useCartStore";
import Button from "@/app/components/commonUI/Button";
import { apiClient } from "@/app/lib/apiClient";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartId, clearCart, fetchCart } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [insideDhaka, setInsideDhaka] = useState(true);
  const [paymentType, setPaymentType] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync cart and prevent hydration UI flashes
  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const deliveryCharge = insideDhaka ? 70 : 110;

  // Calculate subtotal safely for both populated DB items and guest local items
  const subtotal = safeCartItems.reduce((sum, item) => {
    const itemPrice =
      item.price || item.product?.price || item.product?.salePrice || 0;
    const itemSubtotal = item.subTotal || itemPrice * (item.quantity || 1);
    return sum + itemSubtotal;
  }, 0);

  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      setError("Please provide a delivery address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        cartId: cartId || safeCartItems[0]?.cartId || null,
        items: safeCartItems.map((item) => ({
          productId: item.productId || item.product?._id || item._id,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price || item.product?.price || 0,
        })),
        shippingAddress: shippingAddress.trim(),
        insideDhaka,
        paymentType,
        deliveryCharge,
        subtotal,
        grandTotal,
      };

      const response = await apiClient.post("/checkout", payload);

      if (paymentType === "Stripe" && (response?.url || response?.data?.url)) {
        window.location.href = response.url || response.data.url;
      } else if (paymentType === "cash") {
        clearCart();
        router.push("/success");
      }
    } catch (err) {
      console.error("Checkout error:", err);

      // Handle 401 Unauthorized -> Redirect to sign-in page
      if (err?.status === 401 || err?.data?.statusCode === 401) {
        toast.error("You need to sign in to proceed with checkout.");
        // Keep loading=true during timeout to prevent double submission
        setTimeout(() => {
          router.push("/signin?redirect=/checkout");
        }, 1500);
        return;
      }

      setError(
        err?.data?.message ||
          err?.message ||
          "An unexpected error occurred during checkout.",
      );
      setLoading(false);
    }
  };

  // Render spinner until Zustand state hydrates on client
  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (safeCartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mt-2 mb-6 max-w-sm">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Button onClick={() => router.push("/shop")} variant="primary">
          Explore Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete your shipping and payment details below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Area */}
          <form
            onSubmit={handleSubmitOrder}
            className="lg:col-span-7 space-y-6"
          >
            {/* 1. Shipping Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <MapPin className="text-indigo-600" size={20} />
                <h2>Shipping Information</h2>
              </div>

              <Input
                type="textarea"
                label="Full Address"
                placeholder="House no, Street name, Area, City..."
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            {/* 2. Delivery Location Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Truck className="text-indigo-600" size={20} />
                <h2>Delivery Option</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    insideDhaka
                      ? "border-indigo-600 bg-indigo-50/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={insideDhaka}
                        onChange={() => setInsideDhaka(true)}
                        className="accent-indigo-600"
                      />
                      <span className="font-bold text-slate-900">
                        Inside Dhaka
                      </span>
                    </div>
                    <span className="font-black text-indigo-600">৳70</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 pl-5">
                    Standard 24-48 Hours Delivery
                  </p>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    !insideDhaka
                      ? "border-indigo-600 bg-indigo-50/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={!insideDhaka}
                        onChange={() => setInsideDhaka(false)}
                        className="accent-indigo-600"
                      />
                      <span className="font-bold text-slate-900">
                        Outside Dhaka
                      </span>
                    </div>
                    <span className="font-black text-indigo-600">৳110</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 pl-5">
                    Courier 3-5 Days Delivery
                  </p>
                </label>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <CreditCard className="text-indigo-600" size={20} />
                <h2>Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentType === "Stripe"
                      ? "border-indigo-600 bg-indigo-50/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="Stripe"
                    checked={paymentType === "Stripe"}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="accent-indigo-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">
                      Online Payment (Stripe)
                    </p>
                    <p className="text-xs text-slate-500">
                      Pay securely via Credit/Debit Card
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentType === "cash"
                      ? "border-indigo-600 bg-indigo-50/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="cash"
                    checked={paymentType === "cash"}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="accent-indigo-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">
                      Pay cash upon order arrival
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-4 text-base font-bold shadow-lg shadow-indigo-100"
            >
              {loading
                ? "Processing Order..."
                : `Confirm Order • ৳${grandTotal.toFixed(2)}`}
            </Button>
          </form>

          {/* Sidebar Summary Area */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 sticky top-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">
              Order Summary
            </h2>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {safeCartItems.map((item) => {
                const price =
                  item.price ||
                  item.product?.price ||
                  item.product?.salePrice ||
                  0;
                const itemPrice = item.subTotal || price * (item.quantity || 1);

                return (
                  <div
                    key={item._id || item.id || item.productId}
                    className="py-3 flex justify-between items-center text-sm"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-semibold text-slate-800 truncate">
                        {item.product?.title ||
                          item.title ||
                          item.name ||
                          "Product Item"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ৳{itemPrice.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  ৳{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-800">
                  ৳{deliveryCharge}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-slate-900 border-t border-slate-100 pt-3">
                <span>Grand Total</span>
                <span className="text-xl text-indigo-600">
                  ৳{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Encrypted SSL 256-bit payment checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
