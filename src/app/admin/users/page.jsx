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
    } catch (error) {
      console.error("Admin users error:", error);

      setError(
        error.message || "Unable to load users."
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
    } catch (error) {
      console.error("Role update error:", error);

      setError(
        error.message || "Unable to update role."
      );
    } finally {
      setSavingId("");
    }
  }

  const totalUsers = users.length;

  const customerCount = users.filter(
    (user) => user.role === "customer"
  ).length;

  const sellerCount = users.filter(
    (user) => user.role === "seller"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Admin
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Users
                </h1>

                <p className="mt-1 text-gray-600">
                  Manage customer, seller, and admin roles.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadUsers(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <h2 className="font-bold text-gray-900">
                Safe role management
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Only administrators can change user roles.
                You cannot change your own role, and the
                last active administrator cannot be removed.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle
              size={20}
              className="mt-0.5 text-red-600"
            />

            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {customerCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Sellers
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {sellerCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {adminCount}
              </p>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Assign roles for your ComputerHub marketplace.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2
                  size={22}
                  className="animate-spin"
                />
                Loading users...
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <Users
                size={40}
                className="text-gray-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No users found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Register a ComputerHub account first.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Current Role
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Change Role
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const isSaving =
                      savingId === user.id;

                    const selectedRole =
                      selectedRoles[user.id] ||
                      user.role;

                    const isChanged =
                      selectedRole !== user.role;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {user.firstName}{" "}
                            {user.lastName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {user.email}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClasses(
                              user.role
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={selectedRole}
                            onChange={(event) =>
                              handleRoleChange(
                                user.id,
                                event.target.value
                              )
                            }
                            disabled={isSaving}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                        <td className="px-6 py-5">
                          {user.isActive ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Disabled
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              updateRole(user.id)
                            }
                            disabled={
                              isSaving || !isChanged
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isSaving ? (
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}