"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  WalletCards,
} from "lucide-react";

import SellerOrderTable from "@/components/seller/SellerOrderTable";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadOrders(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load seller orders."
        );
      }

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      console.error("Seller orders error:", err);

      setError(
        err?.message || "Unable to load seller orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const customerName =
        `${order.customer?.firstName || ""} ${
          order.customer?.lastName || ""
        }`.trim();

      return (
        String(order.orderNumber || "")
          .toLowerCase()
          .includes(query) ||
        customerName
          .toLowerCase()
          .includes(query) ||
        String(order.customer?.email || "")
          .toLowerCase()
          .includes(query) ||
        String(order.orderStatus || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [orders, search]);

  const pendingCount = orders.filter((order) =>
    [
      "pending",
      "confirmed",
      "processing",
    ].includes(
      String(order.orderStatus || "").toLowerCase()
    )
  ).length;

  const deliveredCount = orders.filter(
    (order) =>
      String(order.orderStatus || "").toLowerCase() ===
      "delivered"
  ).length;

  const sales = orders.reduce(
    (sum, order) =>
      sum + Number(order.sellerSubtotal || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/seller"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
              >
                <ArrowLeft size={17} />
                Seller Dashboard
              </Link>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                  <ShoppingBag size={26} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Seller Center
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    Orders
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                    Track and manage orders containing your products.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-red-800">
                  Unable to load orders
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadOrders()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* STATS */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Total Orders
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {orders.length}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <ShoppingBag size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-400">
                Orders containing your products
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-black text-amber-600">
                    {pendingCount}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock3 size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-400">
                Pending, confirmed or processing
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Delivered
                  </p>

                  <p className="mt-2 text-3xl font-black text-emerald-600">
                    {deliveredCount}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-400">
                Successfully delivered orders
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Your Sales
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    Rs.{" "}
                    {sales.toLocaleString("en-PK")}
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <WalletCards size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-400">
                Value of your products in orders
              </p>
            </div>

          </div>

          {/* SEARCH */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Order Management
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredOrders.length}{" "}
                  {filteredOrders.length === 1
                    ? "order"
                    : "orders"}{" "}
                  shown
                </p>
              </div>

              <div className="relative w-full sm:max-w-md">
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
                  placeholder="Search order, customer or status..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* ORDERS */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Select an order to view details and update its status.
              </p>
            </div>

            <div className="p-3 sm:p-5">
              <SellerOrderTable
                orders={filteredOrders}
                loading={loading}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}