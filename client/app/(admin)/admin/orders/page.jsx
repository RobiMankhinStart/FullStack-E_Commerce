"use client";

import { FiCheckCircle, FiClock, FiPackage, FiTruck } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { MOCK_ORDERS } from "@/app/lib/mockData";

const summary = [
  { label: "Pending", value: "24", icon: FiClock },
  { label: "Packed", value: "18", icon: FiPackage },
  { label: "Shipped", value: "12", icon: FiTruck },
  { label: "Delivered", value: "92", icon: FiCheckCircle },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
              Orders
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Streamline fulfillment
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Monitor priorities, payment status, and delivery progress in one
              view.
            </p>
          </div>
          <Button variant="outline">Export report</Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-700">
                  <Icon size={16} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Order queue</p>
            <h3 className="text-xl font-semibold text-slate-900">
              Recent purchases
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-200 text-slate-600"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-3 py-3">{order.customer}</td>
                  <td className="px-3 py-3">{order.items}</td>
                  <td className="px-3 py-3">${order.total}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-indigo-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
