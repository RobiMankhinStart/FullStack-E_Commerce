"use client";

import { FiCheckCircle } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import { MOCK_USERS } from "@/app/lib/mockData";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
              Users
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Manage team access
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Keep your staff, permissions, and support roles well organized.
            </p>
          </div>
          <Button variant="primary">Invite user</Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_USERS.map((user) => (
          <div
            key={user.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-indigo-50 p-3 text-indigo-700">
                <FiCheckCircle size={18} />
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${user.active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
              >
                {user.active ? "Active" : "Inactive"}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {user.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            <p className="mt-3 text-sm text-slate-600">Role: {user.role}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Edit role
              </Button>
              <Button variant="ghost" size="sm">
                Suspend
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
