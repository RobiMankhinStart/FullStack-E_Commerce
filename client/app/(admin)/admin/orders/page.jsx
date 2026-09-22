"use client";

import { useState, useEffect } from "react";
import {
  FiClock,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiDollarSign,
  FiX,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiRefreshCw,
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import Button from "@/app/components/commonUI/Button";
import Image from "next/image";

import {
  useGetAllOrdersForAdminQuery,
  useUpdateOrderStatusMutation,
} from "../../services/api";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_BADGES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Search Debounce Effect (300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // RTK Query Hooks
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllOrdersForAdminQuery({
      page,
      limit: 10,
      status: statusFilter,
      search: debouncedSearch,
    });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const ordersData = data?.data;
  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const summary = ordersData?.summary || {
    totalRevenue: 0,
    pendingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Status Update Handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();

      // Sync modal state if viewing details of updated order
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Orders Management
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Streamline Fulfillment
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Monitor customer orders, delivery status, and revenue in
              real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh Queue
            </Button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* Revenue */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Total Revenue
            </p>
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <FiDollarSign size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 truncate">
            ৳{(summary.totalRevenue || 0).toLocaleString()}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Pending
            </p>
            <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
              <FiClock size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {summary.pendingCount || 0}
          </p>
        </div>

        {/* Shipped */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Shipped
            </p>
            <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
              <FiTruck size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {summary.shippedCount || 0}
          </p>
        </div>

        {/* Delivered */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Delivered
            </p>
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <FiCheckCircle size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {summary.deliveredCount || 0}
          </p>
        </div>

        {/* Cancelled */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Cancelled
            </p>
            <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
              <FiXCircle size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {summary.cancelledCount || 0}
          </p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Order Queue
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              All Transactions ({pagination.totalOrders})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-60">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Order Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st} className="capitalize">
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium text-slate-400">
              Fetching live orders...
            </p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-rose-700">
            <p className="font-semibold">Failed to load orders.</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-xs font-bold text-rose-800 underline hover:text-rose-900"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-12 text-center text-slate-500">
            <FiPackage className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const badgeStyle =
                    STATUS_BADGES[order.status] ||
                    "bg-slate-100 text-slate-700 border-slate-200";
                  const isThisUpdating =
                    isUpdating && updatingOrderId === order._id;

                  return (
                    <tr
                      key={order._id}
                      className="transition-colors hover:bg-slate-50/80 text-slate-600"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {order.orderNumber || `#${order._id.slice(-6)}`}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {order.user?.name || "Guest Customer"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {order.user?.email || "No email"}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 capitalize font-medium text-slate-800">
                          {order.payment?.method || "cash"}
                        </div>
                        <span
                          className={`inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            order.payment?.status === "paid"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {order.payment?.status || "pending"}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        ৳{order.totalPrice?.toLocaleString()}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-4">
                        <div className="relative inline-flex items-center">
                          <select
                            value={order.status}
                            disabled={isThisUpdating}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${badgeStyle} disabled:opacity-50`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option
                                key={st}
                                value={st}
                                className="bg-white text-slate-900 font-normal capitalize"
                              >
                                {st}
                              </option>
                            ))}
                          </select>
                          {isThisUpdating && (
                            <Loader2 className="ml-2 h-4 w-4 animate-spin text-indigo-600" />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-xs"
                        >
                          <FiEye size={14} /> View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing page{" "}
              <span className="font-semibold text-slate-900">
                {pagination.currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Order Details
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedOrder.orderNumber ||
                    `#${selectedOrder._id.slice(-6)}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Quick Status Switcher */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-sm font-semibold text-slate-700">
                Order Status:
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.status}
                  disabled={isUpdating}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold capitalize focus:outline-none ${
                    STATUS_BADGES[selectedOrder.status]
                  }`}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option
                      key={st}
                      value={st}
                      className="bg-white text-slate-900 capitalize font-normal"
                    >
                      {st}
                    </option>
                  ))}
                </select>
                {isUpdating && (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <FiUser size={14} /> Customer Information
                </div>
                <p className="font-semibold text-slate-900">
                  {selectedOrder.user?.name || "Guest Customer"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FiMail size={12} /> {selectedOrder.user?.email || "N/A"}
                </div>
                {selectedOrder.user?.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <FiPhone size={12} /> {selectedOrder.user.phone}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <FiMapPin size={14} /> Shipping Address
                </div>
                <p className="text-sm font-medium text-slate-800">
                  {selectedOrder.shippingAddress || "N/A"}
                </p>
                <p className="text-xs text-slate-500">
                  Location:{" "}
                  {selectedOrder.insideDhaka ? "Inside Dhaka" : "Outside Dhaka"}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ordered Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                        {item.image ? (
                          <Image
                            fill
                            src={item.image}
                            alt={item.title || "Product image"}
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <FiPackage size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          SKU: {item.sku || "N/A"} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900">
                      ৳
                      {(
                        item.subTotal || item.price * item.quantity
                      )?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Cost Breakdown */}
            <div className="rounded-2xl bg-slate-900 p-4 text-white space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Delivery Charge</span>
                <span>
                  ৳{(selectedOrder.deliveryCharge || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span>৳{(selectedOrder.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
