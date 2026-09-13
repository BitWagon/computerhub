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
  XCircle,
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
          data.message || "Unable to load sellers."
        );
      }

      const users = Array.isArray(data.users)
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
        err.message || "Unable to load sellers."
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
          data.message || "Unable to update seller."
        );
      }

      setSellers((current) =>
        current.map((seller) =>
          seller._id === userId
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
        err.message || "Unable to update seller."
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
      const fullName = `${seller.firstName || ""} ${
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
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Admin Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Store size={25} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Sellers
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage ComputerHub seller accounts.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadSellers}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Refresh Sellers
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle
                className="mt-0.5 shrink-0 text-red-600"
                size={20}
              />

              <div>
                <p className="font-semibold text-red-800">
                  Unable to complete the request
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
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {sellers.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Store size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {activeCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Inactive Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {inactiveCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search sellers by name or email..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Sellers */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              Seller Accounts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredSellers.length} seller
              {filteredSellers.length === 1 ? "" : "s"} shown
            </p>
          </div>

          {isLoading ? (
            <div className="p-10 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">
                Loading sellers...
              </p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Store size={26} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No sellers found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try a different search."
                  : "There are currently no seller accounts."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Seller
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredSellers.map((seller) => {
                      const fullName =
                        `${seller.firstName || ""} ${
                          seller.lastName || ""
                        }`.trim() || "Unnamed Seller";

                      const isActive =
                        seller.isActive !== false;

                      return (
                        <tr
                          key={seller._id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <User size={19} />
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {fullName}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Seller account
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5 text-sm text-gray-700">
                            {seller.email || "No email"}
                          </td>

                          <td className="px-5 py-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              <ShieldCheck size={14} />
                              Seller
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2 size={14} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                <XCircle size={14} />
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-5 text-right">
                            <button
                              type="button"
                              disabled={
                                actionLoading === seller._id
                              }
                              onClick={() =>
                                updateSellerStatus(
                                  seller._id,
                                  !isActive
                                )
                              }
                              className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isActive
                                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              {actionLoading === seller._id
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

              {/* Mobile Cards */}
              <div className="divide-y divide-gray-100 md:hidden">
                {filteredSellers.map((seller) => {
                  const fullName =
                    `${seller.firstName || ""} ${
                      seller.lastName || ""
                    }`.trim() || "Unnamed Seller";

                  const isActive =
                    seller.isActive !== false;

                  return (
                    <div
                      key={seller._id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <User size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {fullName}
                          </h3>

                          <p className="mt-1 break-all text-sm text-gray-500">
                            {seller.email || "No email"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              <ShieldCheck size={13} />
                              Seller
                            </span>

                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2 size={13} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                <XCircle size={13} />
                                Inactive
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={
                              actionLoading === seller._id
                            }
                            onClick={() =>
                              updateSellerStatus(
                                seller._id,
                                !isActive
                              )
                            }
                            className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {actionLoading === seller._id
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
        </div>
      </div>
    </main>
  );
}