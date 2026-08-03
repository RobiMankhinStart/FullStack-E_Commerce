"use client";

import { FiAlertTriangle, FiBox } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { MOCK_INVENTORY } from "@/app/lib/mockData";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
              Inventory
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Maintain healthy stock levels
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Spot critical items early and balance availability with demand.
            </p>
          </div>
          <Button variant="primary">Restock plan</Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total SKUs</p>
            <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-700">
              <FiBox size={16} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">128</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Low stock</p>
            <div className="rounded-2xl bg-amber-100 p-2 text-amber-700">
              <FiAlertTriangle size={16} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">7</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-3 py-3">SKU</th>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVENTORY.map((item) => (
                <tr
                  key={item.sku}
                  className="border-t border-slate-200 text-slate-600"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {item.sku}
                  </td>
                  <td className="px-3 py-3">{item.product}</td>
                  <td className="px-3 py-3">{item.stock}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${item.status === "Critical" ? "bg-rose-100 text-rose-700" : item.status === "Low" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Restock
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
