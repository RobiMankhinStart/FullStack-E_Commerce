"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiCheckCircle,
  FiFilter,
  FiLoader,
  FiLock,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "sonner";

import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import {
  useGetAllUsersForAdminQuery,
  useUpdateUserRoleMutation,
} from "../../services/api";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error } =
    useGetAllUsersForAdminQuery({
      page,
      limit: 10,
      role: roleFilter,
      search,
    });

  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();

  const responseData = data?.data || {};
  const users = responseData?.users || [];
  const summary = responseData?.summary || {};
  const pagination = responseData?.pagination || {};

  const handleRoleChange = async (userId, targetRole, currentRole) => {
    if (currentRole === "admin") {
      toast.error("Existing admins cannot be demoted.");
      return;
    }

    try {
      const res = await updateUserRole({ userId, role: targetRole }).unwrap();
      toast.success(res?.message || `User role updated to ${targetRole}`);
    } catch (err) {
      console.error("Failed to update user role:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to update role",
      );
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Access Control
          </p>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            User Management & Permissions
          </h2>
          <p className="text-sm text-slate-500">
            View accounts, monitor roles, and assign permissions for Admin,
            Editor, and standard users.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Registered
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {isError ? "--" : summary.totalUsers || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Admins (Protected)
          </p>
          <p className="mt-2 text-2xl font-bold text-indigo-600">
            {isError ? "--" : summary.adminCount || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Editors
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {isError ? "--" : summary.editorCount || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Verified Accounts
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {isError ? "--" : summary.verifiedCount || 0}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <FiLoader className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Fetching User List...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-semibold">Failed to load user accounts</p>
          <p className="text-sm">
            {error?.data?.message ||
              "Verify your backend server is running and routes are configured."}
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm text-slate-400">
            Try clearing or adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => {
            const isAdmin = user.role === "admin";
            const isEditor = user.role === "editor";

            return (
              <div
                key={user._id}
                className="relative flex flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-100">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.fullname || "User Avatar"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-50 font-bold uppercase text-indigo-600">
                            {user.fullname ? user.fullname[0] : "U"}
                          </div>
                        )}
                      </div>
                      {user.isVerified ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                          <FiCheckCircle size={12} /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                          <FiXCircle size={12} /> Unverified
                        </span>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${
                        isAdmin
                          ? "bg-indigo-100 text-indigo-800"
                          : isEditor
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {user.fullname || "Unnamed User"}
                  </h3>
                  <p className="break-all text-sm text-slate-500">
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="mt-1 text-xs text-slate-400">{user.phone}</p>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  {isAdmin ? (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs font-medium text-slate-500">
                      <FiLock className="text-slate-400" />
                      <span>Admin accounts cannot be demoted</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Assign Role
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.role !== "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdatingRole}
                            onClick={() =>
                              handleRoleChange(user._id, "admin", user.role)
                            }
                            className="border-indigo-200 text-xs text-indigo-700 hover:bg-indigo-50"
                          >
                            <FiShield size={12} className="mr-1 inline" />{" "}
                            Promote to Admin
                          </Button>
                        )}

                        {user.role !== "editor" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdatingRole}
                            onClick={() =>
                              handleRoleChange(user._id, "editor", user.role)
                            }
                            className="border-amber-200 text-xs text-amber-700 hover:bg-amber-50"
                          >
                            <FiUserCheck size={12} className="mr-1 inline" />{" "}
                            Make Editor
                          </Button>
                        )}

                        {user.role !== "user" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdatingRole}
                            onClick={() =>
                              handleRoleChange(user._id, "user", user.role)
                            }
                            className="text-xs text-slate-600"
                          >
                            Reset to User
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
            <span className="font-semibold text-slate-900">
              {pagination.totalPages}
            </span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
