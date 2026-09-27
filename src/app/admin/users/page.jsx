"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Store,
  UserRound,
  RefreshCw,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ROLE_OPTIONS = [
  {
    value: "customer",
    label: "Customer",
  },
  {
    value: "seller",
    label: "Seller",
  },
  {
    value: "admin",
    label: "Admin",
  },
];

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRoleClasses(role) {
  if (role === "admin") {
    return "bg-purple-100 text-purple-700";
  }

  if (role === "seller") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getRoleLabel(role) {
  if (!role) {
    return "Customer";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  async function loadUsers(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load users."
        );
      }

      setUsers(data.users || []);

      const roles = {};

      (data.users || []).forEach((user) => {
        roles[user.id] = user.role;
      });

      setSelectedRoles(roles);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleRoleChange(userId, role) {
    setSelectedRoles((current) => ({
      ...current,
      [userId]: role,
    }));
  }

  async function updateRole(userId) {
    const role = selectedRoles[userId];

    if (!role) {
      return;
    }

    try {
      setSavingId(userId);
      setError("");

      const response = await fetch(
        "/api/admin/users",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update role."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: data.user.role,
              }
            : user
        )
      );
            setSelectedRoles((current) => ({
        ...current,
        [userId]: data.user.role,
      }));

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update role."
      );
    } finally {
      setSavingId("");
    }
  }

  const totalUsers = users.length;
  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const totalSellers = users.filter(
    (user) => user.role === "seller"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Admin
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Users
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all ComputerHub users and roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing ? "animate-spin" : ""
              }
            />
            Refresh
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle size={18} />

            <span>{error}</span>

          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <Users className="text-blue-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {totalUsers}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <UserRound className="text-gray-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Customers
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {totalCustomers}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <Store className="text-blue-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Sellers
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {totalSellers}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <ShieldCheck className="text-purple-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Admins
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {totalAdmins}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* USERS TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">

              <div className="text-center">

                <Loader2
                  size={34}
                  className="mx-auto animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-gray-500">
                  Loading users...
                </p>

              </div>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      User
                    </th>
                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {users.map((user) => {
                    const busy = savingId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50"
                      >

                        {/* USER */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                              {String(
                                user.name ||
                                  user.firstName ||
                                  "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {user.name ||
                                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                                  "User"}
                              </p>

                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClasses(
                                  user.role
                                )}`}
                              >
                                {getRoleLabel(user.role)}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        {/* JOINED */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            user.createdAt
                          )}
                        </td>

                        {/* ROLE SELECT */}
                        <td className="px-5 py-4">

                          <select
                            value={
                              selectedRoles[user.id] ||
                              user.role
                            }
                            onChange={(event) =>
                              handleRoleChange(
                                user.id,
                                event.target.value
                              )
                            }
                            disabled={busy}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
                          >
                            {ROLE_OPTIONS.map(
                              (option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              )
                            )}
                          </select>

                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">

                          <div className="flex justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                updateRole(
                                  user.id
                                )
                              }
                              disabled={
                                busy ||
                                selectedRoles[
                                  user.id
                                ] === user.role
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {busy ? (
                                <>
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={16} />
                                  Save
                                </>
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}