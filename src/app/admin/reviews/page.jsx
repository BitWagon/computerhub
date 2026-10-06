"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  XCircle,
} from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ============================================================
  // LOAD REVIEWS
  // ============================================================

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/reviews", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load reviews."
        );
      }

      const loadedReviews =
        Array.isArray(data?.reviews)
          ? data.reviews
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

      setReviews(loadedReviews);
    } catch (err) {
      console.error("Admin reviews error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  // ============================================================
  // UPDATE REVIEW
  // ============================================================

  async function updateReview(
    reviewId,
    isApproved
  ) {
    try {
      setActionLoading(reviewId);
      setError("");
      setMessage("");

      const response = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reviewId,
          isApproved,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update review."
        );
      }

      setReviews((current) =>
        current.map((review) =>
          String(
            review?._id || review?.id
          ) === String(reviewId)
            ? {
                ...review,
                isApproved,
              }
            : review
        )
      );

      setMessage(
        isApproved
          ? "Review approved successfully."
          : "Review hidden successfully."
      );
    } catch (err) {
      console.error(
        "Review update error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update review."
      );
    } finally {
      setActionLoading("");
    }
  }

  // ============================================================
  // FILTER REVIEWS
  // ============================================================

  const filteredReviews = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return reviews.filter((review) => {
      const approved =
        review?.isApproved === true;

      if (
        filter === "approved" &&
        !approved
      ) {
        return false;
      }

      if (
        filter === "pending" &&
        approved
      ) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const productName =
        typeof review?.productId ===
        "object"
          ? review?.productId?.name || ""
          : "";

      const searchable = [
        review?.userName,
        review?.userEmail,
        review?.title,
        review?.comment,
        productName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(searchTerm);
    });
  }, [
    reviews,
    search,
    filter,
  ]);

  // ============================================================
  // STATS
  // ============================================================

  const totalReviews = reviews.length;

  const approvedReviews =
    reviews.filter(
      (review) =>
        review?.isApproved === true
    ).length;

  const pendingReviews =
    totalReviews - approvedReviews;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum +
              Number(review?.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  // ============================================================
  // HELPERS
  // ============================================================

  function getProductName(review) {
    if (
      review?.productId &&
      typeof review.productId === "object"
    ) {
      return (
        review.productId.name ||
        "Product"
      );
    }

    return "Product";
  }

  function getProductId(review) {
    if (
      review?.productId &&
      typeof review.productId === "object"
    ) {
      return (
        review.productId._id ||
        review.productId.id ||
        ""
      );
    }

    return review?.productId || "";
  }

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function renderStars(rating) {
    const numericRating = Math.max(
      0,
      Math.min(
        5,
        Number(rating || 0)
      )
    );

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={15}
              className={
                star <= numericRating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }
            />
          )
        )}
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <MessageSquare size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Admin Management
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Customer Reviews
                </h1>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadReviews}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* STATS */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Reviews
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalReviews}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {approvedReviews}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pendingReviews}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Average Rating
            </p>

            <div className="mt-2 flex items-center gap-2">
              <p className="text-3xl font-bold text-slate-900">
                {averageRating}
              </p>

              <Star
                size={21}
                className="fill-amber-400 text-amber-400"
              />
            </div>
          </div>
        </div>

        {/* FILTERS */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search reviews, customers or products..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "all",
                  label: "All Reviews",
                },
                {
                  value: "approved",
                  label: "Approved",
                },
                {
                  value: "pending",
                  label: "Pending",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFilter(
                      item.value
                    )
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    filter === item.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <XCircle size={18} />
            {error}
          </div>
        )}

        {/* REVIEWS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={30}
                  className="mx-auto animate-spin text-blue-600"
                />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading reviews...
                </p>
              </div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <MessageSquare size={25} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No reviews found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are no reviews matching your current
                search or filter.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Product
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Rating
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Review
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReviews.map(
                      (review) => {
                        const reviewId =
                          review?._id ||
                          review?.id;

                        const productId =
                          getProductId(
                            review
                          );

                        const approved =
                          review?.isApproved ===
                          true;

                        return (
                          <tr
                            key={reviewId}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-5 align-top">
                              <p className="font-semibold text-slate-900">
                                {review?.userName ||
                                  "Customer"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {review?.userEmail ||
                                  "—"}
                              </p>

                              <p className="mt-2 text-xs text-slate-400">
                                {formatDate(
                                  review?.createdAt
                                )}
                              </p>
                            </td>

                            <td className="max-w-[220px] px-6 py-5 align-top">
                              {productId ? (
                                <Link
                                  href={`/products/${productId}`}
                                  className="font-semibold text-slate-800 transition hover:text-blue-600"
                                >
                                  {getProductName(
                                    review
                                  )}
                                </Link>
                              ) : (
                                <p className="font-semibold text-slate-800">
                                  {getProductName(
                                    review
                                  )}
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-5 align-top">
                              <div>
                                {renderStars(
                                  review?.rating
                                )}

                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  {Number(
                                    review?.rating ||
                                      0
                                  ).toFixed(1)}
                                  /5
                                </p>
                              </div>
                            </td>

                            <td className="max-w-[330px] px-6 py-5 align-top">
                              <p className="font-semibold text-slate-900">
                                {review?.title ||
                                  "Customer Review"}
                              </p>

                              <p className="mt-1 line-clamp-3 text-sm leading-5 text-slate-500">
                                {review?.comment ||
                                  "No comment provided."}
                              </p>
                            </td>

                            <td className="px-6 py-5 align-top">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                  approved
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {approved ? (
                                  <CheckCircle2
                                    size={14}
                                  />
                                ) : (
                                  <Clock3
                                    size={14}
                                  />
                                )}

                                {approved
                                  ? "Approved"
                                  : "Pending"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right align-top">
                              <div className="flex justify-end gap-2">
                                {productId && (
                                  <Link
                                    href={`/products/${productId}`}
                                    target="_blank"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                    title="View product"
                                  >
                                    <Eye
                                      size={16}
                                    />
                                  </Link>
                                )}

                                <button
                                  type="button"
                                  disabled={
                                    actionLoading ===
                                    reviewId
                                  }
                                  onClick={() =>
                                    updateReview(
                                      reviewId,
                                      !approved
                                    )
                                  }
                                  className={`rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                                    approved
                                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                                  }`}
                                >
                                  {actionLoading ===
                                  reviewId
                                    ? "Saving..."
                                    : approved
                                    ? "Hide"
                                    : "Approve"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredReviews.map(
                  (review) => {
                    const reviewId =
                      review?._id ||
                      review?.id;

                    const productId =
                      getProductId(
                        review
                      );

                    const approved =
                      review?.isApproved ===
                      true;

                    return (
                      <article
                        key={reviewId}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-slate-900">
                              {review?.userName ||
                                "Customer"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {review?.userEmail ||
                                "—"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                              approved
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {approved
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Product
                          </p>

                          {productId ? (
                            <Link
                              href={`/products/${productId}`}
                              className="mt-1 block font-semibold text-slate-900 hover:text-blue-600"
                            >
                              {getProductName(
                                review
                              )}
                            </Link>
                          ) : (
                            <p className="mt-1 font-semibold text-slate-900">
                              {getProductName(
                                review
                              )}
                            </p>
                          )}
                        </div>

                        <div className="mt-4">
                          {renderStars(
                            review?.rating
                          )}

                          <h3 className="mt-3 font-bold text-slate-900">
                            {review?.title ||
                              "Customer Review"}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {review?.comment ||
                              "No comment provided."}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-xs text-slate-400">
                            {formatDate(
                              review?.createdAt
                            )}
                          </p>

                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              reviewId
                            }
                            onClick={() =>
                              updateReview(
                                reviewId,
                                !approved
                              )
                            }
                            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition disabled:opacity-50 ${
                              approved
                                ? "border border-red-200 bg-red-50 text-red-700"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {actionLoading ===
                            reviewId
                              ? "Saving..."
                              : approved
                              ? "Hide Review"
                              : "Approve Review"}
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER INFO */}

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 size={14} />
          Review moderation controls are available to administrators only.
        </div>
      </div>
    </main>
  );
}