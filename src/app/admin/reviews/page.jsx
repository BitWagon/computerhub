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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [updatingId, setUpdatingId] =
    useState("");

  const [deletingId, setDeletingId] =
    useState("");

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

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load reviews."
        );
      }

      setReviews(
        Array.isArray(
          data.reviews
        )
          ? data.reviews
          : []
      );
    } catch (err) {
      console.error(
        "Admin reviews error:",
        err
      );

      setError(
        err.message ||
          "Unable to load reviews."
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

      const response =
        await fetch(
          "/api/reviews",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              reviewId,
              isApproved,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update review."
        );
      }

      toast.success(
        data.message ||
          "Review updated."
      );

      setReviews(
        (currentReviews) =>
          currentReviews.map(
            (review) =>
              String(
                review._id
              ) ===
              String(reviewId)
                ? {
                    ...review,
                    isApproved,
                  }
                : review
          )
      );
    } catch (err) {
      console.error(
        "Update review error:",
        err
      );

      toast.error(
        err.message ||
          "Unable to update review."
      );
    } finally {
      setUpdatingId("");
    }
  }

  /* -------------------------
     DELETE
  ------------------------- */

  async function deleteReview(
    reviewId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reviewId);

      const response =
        await fetch(
          `/api/reviews?reviewId=${encodeURIComponent(
            reviewId
          )}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to delete review."
        );
      }

      toast.success(
        "Review deleted successfully."
      );

      setReviews(
        (currentReviews) =>
          currentReviews.filter(
            (review) =>
              String(
                review._id
              ) !==
              String(reviewId)
          )
      );
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      toast.error(
        err.message ||
          "Unable to delete review."
      );
    } finally {
      setDeletingId("");
    }
  }

  /* -------------------------
     FILTER
  ------------------------- */

  const filteredReviews =
    reviews.filter((review) => {
      const productName =
        review.productId?.name ||
        "";

      const customerName =
        review.userName || "";

      const customerEmail =
        review.userEmail || "";

      const title =
        review.title || "";

      const comment =
        review.comment || "";

      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !searchText ||
        productName
          .toLowerCase()
          .includes(searchText) ||
        customerName
          .toLowerCase()
          .includes(searchText) ||
        customerEmail
          .toLowerCase()
          .includes(searchText) ||
        title
          .toLowerCase()
          .includes(searchText) ||
        comment
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "all" ||
        (filter === "approved" &&
          review.isApproved) ||
        (filter === "rejected" &&
          !review.isApproved);

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  /* -------------------------
     COUNTS
  ------------------------- */

  const totalReviews =
    reviews.length;

  const approvedReviews =
    reviews.filter(
      (review) =>
        review.isApproved
    ).length;

  const rejectedReviews =
    reviews.filter(
      (review) =>
        !review.isApproved
    ).length;

  /* -------------------------
     LOADING
  ------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 rounded bg-gray-200" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="h-28 rounded-xl bg-gray-200" />
              <div className="h-28 rounded-xl bg-gray-200" />
              <div className="h-28 rounded-xl bg-gray-200" />
            </div>

            <div className="h-16 rounded-xl bg-gray-200" />

            <div className="h-96 rounded-xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------
     ERROR
  ------------------------- */

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="rounded-xl border border-red-200 bg-white p-10">
            <XCircle
              className="mx-auto text-red-500"
              size={45}
            />

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Unable to Load Reviews
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadReviews}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-blue-600"
            >
              <ChevronLeft
                size={16}
              />
              Admin Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Review Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage customer product reviews.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* TOTAL */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Reviews
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalReviews}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Star
                  size={23}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* APPROVED */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Approved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {approvedReviews}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2
                  size={23}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          {/* REJECTED */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Rejected
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {rejectedReviews}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <XCircle
                  size={23}
                  className="text-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH / FILTER */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search product, customer or review..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* FILTER */}
            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Reviews
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>

        {/* REVIEW LIST */}
        <div className="mt-6 space-y-5">
          {filteredReviews.length ===
          0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <Star
                size={42}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                No Reviews Found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                No reviews match your current search or filter.
              </p>
            </div>
          ) : (
            filteredReviews.map(
              (review) => {
                const product =
                  review.productId;

                const productName =
                  product?.name ||
                  "Unknown Product";

                const productImage =
                  product?.images?.[0] ||
                  product?.image ||
                  "";

                const rating =
                  Number(
                    review.rating || 0
                  );

                const date =
                  review.createdAt
                    ? new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "";

                return (
                  <div
                    key={
                      review._id
                    }
                    className="rounded-xl border border-gray-200 bg-white p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row">
                      {/* PRODUCT */}
                      <div className="flex min-w-0 gap-4 lg:w-72">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          {productImage ? (
                            <img
                              src={
                                productImage
                              }
                              alt={
                                productName
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Product
                          </p>

                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
                            {productName}
                          </h3>

                          {product?._id && (
                            <Link
                              href={`/products/${product._id}`}
                              target="_blank"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                              View Product
                              <Eye
                                size={13}
                              />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* REVIEW */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[
                              1,
                              2,
                              3,
                              4,
                              5,
                            ].map(
                              (star) => (
                                <Star
                                  key={
                                    star
                                  }
                                  size={17}
                                  className={
                                    star <=
                                    rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              )
                            )}
                          </div>

                          <span className="text-sm font-semibold text-gray-900">
                            {rating}/5
                          </span>

                          {review.isApproved ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              <CheckCircle2
                                size={13}
                              />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              <XCircle
                                size={13}
                              />
                              Rejected
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 text-lg font-bold text-gray-900">
                          {review.title}
                        </h2>

                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                          {review.comment}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                          <span>
                            By{" "}
                            <strong className="font-semibold text-gray-700">
                              {review.userName ||
                                "Customer"}
                            </strong>
                          </span>

                          <span>
                            {review.userEmail}
                          </span>

                          {date && (
                            <span className="inline-flex items-center gap-1">
                              <Clock
                                size={13}
                              />
                              {date}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-start gap-2 lg:w-44 lg:flex-col">
                        {review.isApproved ? (
                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              review._id
                            }
                            onClick={() =>
                              updateReview(
                                review._id,
                                false
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <XCircle
                              size={16}
                            />

                            {updatingId ===
                            review._id
                              ? "Updating..."
                              : "Reject"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              review._id
                            }
                            onClick={() =>
                              updateReview(
                                review._id,
                                true
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCircle2
                              size={16}
                            />

                            {updatingId ===
                            review._id
                              ? "Updating..."
                              : "Approve"}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            review._id
                          }
                          onClick={() =>
                            deleteReview(
                              review._id
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={16}
                          />

                          {deletingId ===
                          review._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
    </main>
  );
}