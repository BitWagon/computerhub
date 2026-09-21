"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react";

import SellerOrderTable from "@/components/seller/SellerOrderTable";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  async function loadOrders(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await fetch("/api/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load seller orders."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      console.error(
        "Seller orders error:",
        err
      );

      setError(
        err.message ||
          "Unable to load seller orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return orders;
      }

      return orders.filter(
        (order) => {
          const customerName =
            `${order.customer?.firstName || ""} ${
              order.customer?.lastName || ""
            }`.trim();

          return (
            String(
              order.orderNumber || ""
            )
              .toLowerCase()
              .includes(query) ||
            customerName
              .toLowerCase()
              .includes(query) ||
            String(
              order.customer?.email ||
                ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              order.orderStatus || ""
            )
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [orders, search]);

  const pendingCount =
    orders.filter(
      (order) =>
        [
          "pending",
          "confirmed",
          "processing",
        ].includes(
          String(
            order.orderStatus || ""
          ).toLowerCase()
        )
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        String(
          order.orderStatus || ""
        ).toLowerCase() ===
        "delivered"
    ).length;

  const sales =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.sellerSubtotal || 0
        ),
      0
    );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/seller"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Seller Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <ShoppingBag
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage orders containing your products.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              loadOrders(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Your Sales
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              Rs.{" "}
              {sales.toLocaleString(
                "en-PK"
              )}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Delivered: {deliveredCount}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search order number, customer or status..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <SellerOrderTable
          orders={filteredOrders}
          loading={loading}
        />
      </div>
    </main>
  );
}