"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load users."
        );
      }

      setUsers(
        Array.isArray(data?.users)
          ? data.users
          : []
      );
    } catch (err) {
      console.error("Admin users error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      const name =
        user?.name ||
        `${user?.firstName || ""} ${
          user?.lastName || ""
        }`;

      return [
        name,
        user?.email,
        user?.role,
        user?._id,
      ].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [users, search]);

  const stats = useMemo(() => {
    return {
      total: users.length,

      customers: users.filter(
        (user) => user?.role === "customer"
      ).length,

      sellers: users.filter(
        (user) => user?.role === "seller"
      ).length,

      admins: users.filter(
        (user) => user?.role === "admin"
      ).length,
    };
  }, [users]);

  function getUserName(user) {
    if (user?.name) {
      return user.name;
    }

    const fullName =
      `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.trim();

    return fullName || "User";
  }

  function getInitials(user) {
    const name = getUserName(user);

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function getRoleClasses(role) {
    switch (role) {
      case "admin":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "seller":
        return "border-blue-200 bg-blue-50 text-blue-700";

      default:
        return "border-slate-200 bg-slate-100 text-slate-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Users size={21} />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Administration
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              User Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              View registered ComputerHub accounts and
              monitor marketplace user roles.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh Users
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={stats.total}
            icon={<Users size={19} />}
          />

          <StatCard
            label="Customers"
            value={stats.customers}
            icon={<UserCheck size={19} />}
          />

          <StatCard
            label="Sellers"
            value={stats.sellers}
            icon={<ShieldCheck size={19} />}
          />

          <StatCard
            label="Admins"
            value={stats.admins}
            icon={<ShieldCheck size={19} />}
          />
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, email, role, or user ID..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {users.length}
              </span>{" "}
              users
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-slate-700 hover:text-slate-950"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* USERS */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              ComputerHub accounts currently available to
              the administration system.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Account
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    User ID
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-14 text-center"
                    >
                      <RefreshCw
                        size={24}
                        className="mx-auto animate-spin text-slate-400"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading users...
                      </p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                          <UserX
                            size={24}
                            className="text-slate-400"
                          />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                          No users found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Try a different search.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const role =
                      user?.role || "customer";

                    return (
                      <tr
                        key={user._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                              {getInitials(user)}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-950">
                                {getUserName(user)}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                ComputerHub account
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="text-sm text-slate-600">
                            {user?.email || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getRoleClasses(
                              role
                            )}`}
                          >
                            {role}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                            <UserCheck size={15} />
                            Registered
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span className="font-mono text-xs text-slate-400">
                            {String(user?._id || "—")}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-slate-400 lg:hidden">
          Swipe horizontally to view all user details.
        </p>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

        <span className="text-slate-400">
          {icon}
        </span>
      </div>

      <p className="text-3xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}