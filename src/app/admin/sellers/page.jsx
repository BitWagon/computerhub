"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  ShieldCheck,
  Store,
  User,
  UserCheck,
  UserX,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    loadSellers();
  }, []);

  async function loadSellers() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load sellers."
        );
      }

      const users = Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data)
        ? data
        : [];

      const sellerUsers = users.filter(
        (user) => user.role === "seller"
      );

      setSellers(sellerUsers);
    } catch (err) {
      console.error("Load sellers error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load sellers."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updateSellerStatus(userId, isActive) {
    try {
      setActionLoading(userId);
      setError("");

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to update seller."
        );
      }

      setSellers((current) =>
        current.map((seller) =>
          String(seller._id || seller.id) === String(userId)
            ? {
                ...seller,
                isActive,
              }
            : seller
        )
      );
    } catch (err) {
      console.error("Update seller error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update seller."
      );
    } finally {
      setActionLoading("");
    }
  }

  const filteredSellers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sellers;
    }

    return sellers.filter((seller) => {
      const fullName =
        `${seller.firstName || ""} ${
          seller.lastName || ""
        }`.trim();

      return (
        fullName.toLowerCase().includes(query) ||
        String(seller.email || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [sellers, search]);

  const activeCount = sellers.filter(
    (seller) => seller.isActive !== false
  ).length;

  const inactiveCount = sellers.filter(
    (seller) => seller.isActive === false
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <Store size={26} />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Seller Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage verified ComputerHub seller accounts,
                access, and account status.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSellers}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <UserX
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="font-semibold text-red-900">
                  Request failed
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {sellers.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Store size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {activeCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Inactive
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {inactiveCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <UserX size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search seller name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Seller list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Seller Accounts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredSellers.length} seller
                {filteredSellers.length === 1 ? "" : "s"} shown
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <ShieldCheck size={14} />
              Seller Access
            </div>
          </div>

          {isLoading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading seller accounts...
              </p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Store size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                No sellers found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "No seller account matches your search."
                  : "There are currently no seller accounts."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Seller
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredSellers.map((seller) => {
                      const sellerId =
                        seller._id || seller.id;

                      const fullName =
                        `${seller.firstName || ""} ${
                          seller.lastName || ""
                        }`.trim() || "Unnamed Seller";

                      const isActive =
                        seller.isActive !== false;

                      return (
                        <tr
                          key={sellerId}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <User size={19} />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-950">
                                  {fullName}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  ComputerHub seller
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail
                                size={15}
                                className="shrink-0 text-slate-400"
                              />
                              <span>
                                {seller.email || "No email"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                              <ShieldCheck size={14} />
                              Seller
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 size={14} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                                <UserX size={14} />
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-5 text-right">
                            <button
                              type="button"
                              disabled={
                                actionLoading === sellerId
                              }
                              onClick={() =>
                                updateSellerStatus(
                                  sellerId,
                                  !isActive
                                )
                              }
                              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isActive
                                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {actionLoading === sellerId
                                ? "Updating..."
                                : isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredSellers.map((seller) => {
                  const sellerId =
                    seller._id || seller.id;

                  const fullName =
                    `${seller.firstName || ""} ${
                      seller.lastName || ""
                    }`.trim() || "Unnamed Seller";

                  const isActive =
                    seller.isActive !== false;

                  return (
                    <div
                      key={sellerId}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <User size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-bold text-slate-950">
                              {fullName}
                            </h3>

                            {isActive ? (
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 size={13} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                <UserX size={13} />
                                Inactive
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <Mail
                              size={14}
                              className="shrink-0"
                            />
                            <span className="break-all">
                              {seller.email || "No email"}
                            </span>
                          </div>

                          <div className="mt-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                              <ShieldCheck size={13} />
                              Seller Account
                            </span>
                          </div>

                          <button
                            type="button"
                            disabled={
                              actionLoading === sellerId
                            }
                            onClick={() =>
                              updateSellerStatus(
                                sellerId,
                                !isActive
                              )
                            }
                            className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {actionLoading === sellerId
                              ? "Updating..."
                              : isActive
                              ? "Deactivate Seller"
                              : "Activate Seller"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}