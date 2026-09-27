"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  Eye,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  /* -------------------------
     LOAD REVIEWS
  ------------------------- */

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/reviews?includeAll=true",
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load reviews."
        );
      }

      setReviews(
        Array.isArray(data.reviews)
          ? data.reviews
          : []
      );

    } catch (err) {
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

  /* -------------------------
     APPROVE / REJECT
  ------------------------- */

  async function updateReview(
    reviewId,
    isApproved
  ) {
    try {
      setUpdatingId(reviewId);

      const response = await fetch(
        "/api/reviews",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            reviewId,
            isApproved,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update review."
        );
      }

      toast.success(
        data.message || "Review updated."
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          String(review._id) === String(reviewId)
            ? {
                ...review,
                isApproved,
              }
            : review
        )
      );

    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update review."
      );
    } finally {
      setUpdatingId("");
    }
  }

  /* -------------------------
     DELETE REVIEW
  ------------------------- */

  async function deleteReview(reviewId) {
    const confirmed = window.confirm(
      "Delete this review permanently?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reviewId);

      const response = await fetch(
        `/api/reviews?reviewId=${reviewId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete review."
        );
      }

      toast.success(
        data.message || "Review deleted."
      );

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) =>
            String(review._id) !== String(reviewId)
        )
      );

    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to delete review."
      );
    } finally {
      setDeletingId("");
    }
  }
    /* -------------------------
     FILTER REVIEWS
  ------------------------- */

  const filteredReviews = reviews.filter((review) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      String(review.userName || "")
        .toLowerCase()
        .includes(keyword) ||
      String(review.productName || "")
        .toLowerCase()
        .includes(keyword) ||
      String(review.comment || "")
        .toLowerCase()
        .includes(keyword);

    if (filter === "approved") {
      return matchesSearch && review.isApproved;
    }

    if (filter === "pending") {
      return matchesSearch && !review.isApproved;
    }

    return matchesSearch;
  });

  const approvedCount = reviews.filter(
    (review) => review.isApproved
  ).length;

  const pendingCount =
    reviews.length - approvedCount;

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
              <ChevronLeft size={17} />
              Back to Admin
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Reviews
            </h1>

            <p className="mt-1 text-gray-500">
              Approve, reject and manage customer reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReviews}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">
                  Total Reviews
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {reviews.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Approved
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600">
                  {approvedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>
                <p className="mt-1 text-3xl font-bold text-orange-600">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search reviews..."
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setFilter("approved")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  filter === "approved"
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                Approved
              </button>

              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  filter === "pending"
                    ? "bg-orange-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-gray-500">
                Loading reviews...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Rating
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                                    {filteredReviews.map((review) => {
                    const approving =
                      updatingId === String(review._id);

                    const deleting =
                      deletingId === String(review._id);

                    return (
                      <tr
                        key={review._id}
                        className="hover:bg-gray-50"
                      >
                        {/* CUSTOMER */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.userName || "Customer"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {review.userEmail || "—"}
                            </p>
                          </div>
                        </td>

                        {/* PRODUCT */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.productName}
                            </p>

                            <p className="text-xs text-gray-500 max-w-xs truncate">
                              {review.comment}
                            </p>
                          </div>
                        </td>

                        {/* RATING */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            {Array.from({
                              length: 5,
                            }).map((_, index) => (
                              <Star
                                key={index}
                                size={16}
                                className={
                                  index <
                                  Number(review.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          {review.isApproved ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              <CheckCircle2 size={14} />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                              <Clock size={14} />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <Link
                              href={`/products/${review.productId}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              <Eye size={14} />
                              View
                            </Link>

                            {review.isApproved ? (
                              <button
                                type="button"
                                disabled={approving}
                                onClick={() =>
                                  updateReview(
                                    review._id,
                                    false
                                  )
                                }
                                className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                              >
                                {approving
                                  ? "Saving..."
                                  : "Reject"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={approving}
                                onClick={() =>
                                  updateReview(
                                    review._id,
                                    true
                                  )
                                }
                                className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                              >
                                {approving
                                  ? "Saving..."
                                  : "Approve"}
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() =>
                                deleteReview(review._id)
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              {deleting
                                ? "Deleting..."
                                : "Delete"}
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

          {!loading && filteredReviews.length === 0 && (
            <div className="border-t border-gray-200 p-12 text-center">
              <Star
                size={42}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No reviews found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search or filter."
                  : "No customer reviews are available."}
              </p>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review management shortcuts.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <button
              type="button"
              onClick={loadReviews}
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Search
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Refresh Reviews
                  </h3>

                  <p className="text-sm text-gray-500">
                    Reload latest customer reviews.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={async () => {
                const pending = reviews.filter(
                  (review) => !review.isApproved
                );

                if (pending.length === 0) {
                  toast.success(
                    "No pending reviews."
                  );
                  return;
                }

                for (const review of pending) {
                  await updateReview(
                    review._id,
                    true
                  );
                }

                toast.success(
                  "All pending reviews approved."
                );
              }}
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-green-300 hover:bg-green-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <CheckCircle2
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Approve All Pending
                  </h3>

                  <p className="text-sm text-gray-500">
                    Approve every pending review.
                  </p>
                </div>
              </div>
            </button>

            <Link
              href="/admin/products"
              className="group rounded-xl border border-gray-200 p-5 transition hover:border-purple-300 hover:bg-purple-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3">
                  <Eye
                    size={22}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    View Products
                  </h3>

                  <p className="text-sm text-gray-500">
                    Open the product management page.
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </main>
  );
}