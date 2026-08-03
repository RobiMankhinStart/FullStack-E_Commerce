"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiArrowUpRight,
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { MOCK_ORDERS, MOCK_REVENUE_DATA } from "@/app/lib/mockData";

const kpiCards = [
  {
    label: "Revenue",
    value: "$84,240",
    trend: "+12.5%",
    icon: FiDollarSign,
    accent: "indigo",
  },
  {
    label: "Customers",
    value: "1,208",
    trend: "+8.2%",
    icon: FiUsers,
    accent: "sky",
  },
  {
    label: "Orders",
    value: "342",
    trend: "+15.1%",
    icon: FiShoppingCart,
    accent: "emerald",
  },
  {
    label: "Stock Alerts",
    value: "24",
    trend: "-2.0%",
    icon: FiPackage,
    accent: "amber",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-indigo-600">
              Executive summary
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Your store is performing beautifully
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Welcome back. Keep an eye on revenue, customer activity, and
              inventory health from one polished workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="flex items-center gap-2 font-medium">
              <FiArrowUpRight />
              Conversion trend is up 14.2%
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`rounded-xl p-3 ${card.accent === "indigo" ? "bg-indigo-50 text-indigo-600" : card.accent === "sky" ? "bg-sky-50 text-sky-600" : card.accent === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                >
                  <Icon size={20} />
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  {card.trend} <FiArrowUpRight size={14} />
                </span>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Revenue trend</p>
              <h3 className="text-xl font-semibold text-slate-900">
                Sales performance
              </h3>
            </div>
            <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
              +18.4%
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="font-semibold text-slate-900">Recent activity</h4>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <p>• New order #ORD-7722 placed by Elena V.</p>
            <p>• Product “Studio Wireless X” was restocked.</p>
            <p>• Category “Minimalist Tech” was updated.</p>
          </div>
          <div className="mt-6 rounded-[24px] bg-gradient-to-br from-indigo-700 to-indigo-500 p-5 text-white">
            <h4 className="font-semibold">Need help?</h4>
            <p className="mt-2 text-sm text-indigo-100">
              Review your docs for analytics and API setup guidance.
            </p>
            <Button variant="light" className="mt-4">
              View docs
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Latest orders</p>
            <h3 className="text-xl font-semibold text-slate-900">
              Recent customer activity
            </h3>
          </div>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-200 text-slate-600"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-3 py-3">{order.customer}</td>
                  <td className="px-3 py-3">${order.total}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-indigo-700">
                      {order.status}
                    </span>
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
