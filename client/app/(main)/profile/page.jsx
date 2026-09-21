"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Package,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import BreadCrumb from "@/app/components/commonUI/BreadCrumb";

export default function ProfilePage() {
  const breadcrumbItems = [{ name: "Profile", href: "/profile" }];
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Form & User states
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch Profile & Orders Data
  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        setLoading(true);
        // Fetch Profile
        const profileRes = await apiClient.get("/auth/profile");
        const userData = profileRes?.data?.data || profileRes?.data;

        if (userData) {
          setFormData({
            fullname: userData.fullname || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            role: userData.role || "user",
          });
          setAvatarUrl(userData.avatar || "");
        }

        // Fetch Orders
        setLoadingOrders(true);
        const ordersRes = await apiClient.get("/order/my-orders");
        const normalizedOrders = Array.isArray(ordersRes?.data)
          ? ordersRes.data
          : Array.isArray(ordersRes?.data?.data)
            ? ordersRes.data.data
            : [];

        setOrders(normalizedOrders);
      } catch (error) {
        console.error("Failed to load data:", error);
        if (error?.response?.status === 401) {
          router.push("/signin");
        }
      } finally {
        setLoading(false);
        setLoadingOrders(false);
      }
    };

    fetchProfileAndOrders();
  }, [router]);
  // Handle avatar file selection & live preview
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: "error",
          message: "Image size should be less than 5MB.",
        });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFeedback({ type: "", message: "" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      if (avatarFile) data.append("avatar", avatarFile);

      const response = await apiClient.put("/auth/updateprofile", data);
      const updatedUser = response?.data?.data || response?.data;

      if (updatedUser) {
        setFormData((prev) => ({
          ...prev,
          fullname: updatedUser.fullname || prev.fullname,
          phone: updatedUser.phone || prev.phone,
          address: updatedUser.address || prev.address,
        }));
        if (updatedUser.avatar) setAvatarUrl(updatedUser.avatar);
        setAvatarFile(null);
        setAvatarPreview(null);
        setFeedback({
          type: "success",
          message: "Profile updated successfully!",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto space-y-8 mt-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your personal profile details and view order history.
          </p>
        </div>
        {/* <div className="flex"> */}
        {/* Profile Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50"
        >
          {/* Avatar & Role Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
            <div className="relative group">
              <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-100 ring-4 ring-slate-50 shadow-inner flex items-center justify-center">
                {avatarPreview || avatarUrl ? (
                  <Image
                    src={avatarPreview || avatarUrl}
                    alt="User Avatar"
                    fill
                    sizes="112px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              >
                <Camera className="w-6 h-6" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {formData.fullname || "User Name"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <ShieldCheck className="w-3 h-3" />
                  {formData.role}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400">
                Click on the avatar image to select a new profile picture.
              </p>
            </div>
          </div>

          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              {feedback.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  className="bg-slate-100/60! text-slate-500! cursor-not-allowed!"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Account Type
                </label>
                <Input
                  type="text"
                  value={formData.role.toUpperCase()}
                  disabled
                  className="bg-slate-100/60! text-slate-500! cursor-not-allowed! font-bold!"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Shipping Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows={3}
                  placeholder="123 Main Street, Suite 100, New York, NY"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm font-semibold rounded-2xl border border-transparent focus:border-slate-200 focus:outline-none transition-all duration-200 shadow-inner resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <Button
                type="submit"
                loading={saving}
                className="px-8! py-3.5! bg-indigo-600! hover:bg-indigo-700! text-white! text-xs! font-bold! uppercase! tracking-widest! rounded-full! shadow-lg shadow-indigo-200"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Order List Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" />
              Order History
            </h2>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                You haven&apos;t placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-indigo-100 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="space-y-2 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                        {order.orderNumber}
                      </span>
                      {order.payment?.method === "stripe" ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          Paid (Stripe)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                          Cash on Delivery
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>{order.items?.length || 0} Items</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        Total
                      </p>
                      <p className="text-lg font-black text-indigo-600">
                        ৳{order.totalPrice}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-600 flex items-center justify-center transition-colors shrink-0">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        {/* </div> */}
      </div>
    </div>
  );
}
