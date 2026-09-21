"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import BreadCrumb from "@/app/components/commonUI/BreadCrumb";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const breadcrumbItems = [
    { name: "Profile", href: "/profile" },
    { name: "Order Details", href: id ? `/orders/${id}` : "#" },
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const res = await apiClient.get(`/order/${id}`);

        // Defensive unwrapping: handles both standard Axios and unwrapped interceptor responses
        const fetchedOrder = res?.data?.data || res?.data || res;

        if (fetchedOrder && (fetchedOrder._id || fetchedOrder.orderNumber)) {
          setOrder(fetchedOrder);
        } else {
          setError("Order details not found.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Order...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Package className="w-16 h-16 text-slate-300" />
        <p className="text-lg font-bold text-slate-700">
          {error || "Order not found"}
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto mt-6">
        {/* Header Actions */}
        <button
          onClick={() => router.push("/profile")}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50">
          {/* Order Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Order Number
              </p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {order.orderNumber}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-slate-500">
                <Clock className="w-4 h-4" />
                {order.createdAt &&
                  new Date(order.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                <CheckCircle2 className="w-4 h-4" />
                {order.status || "Confirmed"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100">
            {/* Delivery Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                <Truck className="w-5 h-5 text-indigo-600" />
                Delivery Information
              </div>
              <div className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <p>{order.shippingAddress}</p>
                </div>
                <p className="mt-3 pt-3 border-t border-slate-200/60 font-semibold text-slate-700">
                  Zone: {order.insideDhaka ? "Inside Dhaka" : "Outside Dhaka"}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Payment Method
              </div>
              <div className="text-sm text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="capitalize text-lg font-black text-slate-800">
                  {order.payment?.method === "stripe"
                    ? "Card / Stripe"
                    : order.payment?.method === "cash"
                      ? "Cash on Delivery"
                      : order.payment?.method || "Cash"}
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500 capitalize flex items-center gap-1">
                  Status: {order.payment?.status || "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="py-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Order Items ({order.items?.length || 0})
            </h3>

            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item._id || item.product}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    {item.sku && (
                      <p className="text-xs font-semibold text-slate-400 mt-1">
                        SKU: {item.sku}
                      </p>
                    )}
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm font-semibold text-slate-600">
                      <span>Qty: {item.quantity}</span>
                      <span>×</span>
                      <span>৳{item.price}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-indigo-600">
                      ৳{item.subTotal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals Summary */}
          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <div className="w-full sm:w-80 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Subtotal</span>
                <span>
                  ৳{(order.totalPrice || 0) - (order.deliveryCharge || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Delivery Charge</span>
                <span>৳{order.deliveryCharge || 0}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-2xl font-black text-indigo-600">
                  ৳{order.totalPrice || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
