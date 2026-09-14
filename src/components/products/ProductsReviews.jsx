"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Trash2,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductReviews({
  productId,
}) {
  const [reviews, setReviews] =
    useState([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [totalReviews, setTotalReviews] =
    useState(0);

  const [distribution, setDistribution] =
    useState({
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    });

  const [rating, setRating] =
    useState(5);

  const [title, setTitle] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);


  /*
   * Load reviews
   */

  const loadReviews = async () => {
    if (!productId) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/reviews?productId=${encodeURIComponent(
            productId
          )}`,
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load reviews."
        );
      }

      setReviews(
        Array.isArray(data.reviews)
          ? data.reviews
          : []
      );

      setAverageRating(
        Number(
          data.averageRating || 0
        )
      );

      setTotalReviews(
        Number(
          data.totalReviews || 0
        )
      );

      setDistribution(
        data.distribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        }
      );
    } catch (error) {
      console.error(
        "Review loading error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReviews();
  }, [productId]);


  /*
   * Submit review
   */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!productId) {
      return;
    }

    if (!title.trim()) {
      toast.error(
        "Please enter a review title."
      );

      return;
    }

    if (!comment.trim()) {
      toast.error(
        "Please write your review."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response =
        await fetch(
          "/api/reviews",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              productId,
              rating,
              title:
                title.trim(),
              comment:
                comment.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to submit review."
        );
      }

      toast.success(
        "Review submitted successfully!"
      );

      setRating(5);
      setTitle("");
      setComment("");

      await loadReviews();
    } catch (error) {
      console.error(
        "Review submission error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };


  /*
   * Delete review
   */

  const handleDelete = async (
    reviewId
  ) => {
    if (!reviewId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
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

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete review."
        );
      }

      toast.success(
        "Review deleted successfully."
      );

      await loadReviews();
    } catch (error) {
      console.error(
        "Review deletion error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to delete review."
      );
    }
  };


  /*
   * Stars
   */

  const renderStars = (
    value,
    size = 18
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={size}
              className={
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          )
        )}
      </div>
    );
  };


  /*
   * Loading
   */

  if (loading) {
    return (
      <section className="mt-12 border-t border-gray-200 pt-10">
        <div className="animate-pulse">
          <div className="h-7 w-48 rounded bg-gray-200" />

          <div className="mt-6 h-24 rounded-2xl bg-gray-100" />

          <div className="mt-6 h-32 rounded-2xl bg-gray-100" />
        </div>
      </section>
    );
  }


  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      {/* HEADER */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Customer Reviews
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
          Product Reviews
        </h2>
      </div>


      {/* RATING SUMMARY */}

      <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-3">
        {/* Average */}

        <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-6 md:border-b-0 md:border-r md:pb-0">
          <div className="text-5xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>

          <div className="mt-3">
            {renderStars(
              Math.round(
                averageRating
              ),
              20
            )}
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {totalReviews}{" "}
            {totalReviews === 1
              ? "review"
              : "reviews"}
          </p>
        </div>


        {/* Distribution */}

        <div className="md:col-span-2">
          {[5, 4, 3, 2, 1].map(
            (star) => {
              const count =
                Number(
                  distribution[
                    star
                  ] || 0
                );

              const percentage =
                totalReviews > 0
                  ? Math.round(
                      (count /
                        totalReviews) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={star}
                  className="mb-3 flex items-center gap-3"
                >
                  <div className="flex w-12 items-center gap-1 text-sm text-gray-600">
                    <span>
                      {star}
                    </span>

                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </div>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="w-10 text-right text-sm text-gray-500">
                    {count}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>


      {/* WRITE REVIEW */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-gray-900">
            Write a Review
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Share your experience with this product.
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Rating */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Rating
            </label>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(star)
                    }
                    className="transition-transform hover:scale-110"
                    aria-label={`${star} stars`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                )
              )}
            </div>
          </div>


          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Review Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              maxLength={150}
              placeholder="Example: Excellent laptop"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>


          {/* Comment */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Review
            </label>

            <textarea
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value
                )
              }
              maxLength={2000}
              rows={5}
              placeholder="Tell other customers about your experience..."
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>


          {/* Submit */}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />

            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </div>


      {/* REVIEWS LIST */}

      <div className="mt-8">
        <h3 className="mb-5 text-xl font-bold text-gray-900">
          Customer Feedback
        </h3>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="font-semibold text-gray-700">
              No reviews yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Be the first customer to review this product.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map(
              (review) => (
                <article
                  key={review._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        {renderStars(
                          Number(
                            review.rating
                          )
                        )}

                        <span className="text-sm font-medium text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>

                      <h4 className="mt-3 text-lg font-bold text-gray-900">
                        {review.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          review._id
                        )
                      }
                      className="inline-flex h-fit items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700"
                    >
                      <Trash2
                        size={16}
                      />

                      Delete
                    </button>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600">
                    {review.comment}
                  </p>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {review.userName}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}