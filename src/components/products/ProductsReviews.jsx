"use client";

import { Star, UserRound } from "lucide-react";

const defaultReviews = [
  {
    id: 1,
    name: "Verified Buyer",
    rating: 5,
    date: "Recently",
    comment:
      "Excellent product. The quality is very good and the product arrived safely.",
  },
  {
    id: 2,
    name: "Customer",
    rating: 4,
    date: "Recently",
    comment:
      "Good product and works as expected. Delivery was also quick.",
  },
];

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

export default function ProductReviews({
  reviews = defaultReviews,
  rating = 4.5,
}) {
  const safeReviews =
    Array.isArray(reviews) && reviews.length > 0
      ? reviews
      : defaultReviews;

  const roundedRating = Math.round(
    Number(rating) || 0
  );

  const ratingDistribution = {
    5: 78,
    4: 55,
    3: 22,
    2: 8,
    1: 3,
  };

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Customer Reviews
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-7 md:grid-cols-[160px_1fr]">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-gray-900">
              {Number(rating).toFixed(1)}
            </div>

            <div className="mt-2">
              <RatingStars rating={roundedRating} />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Based on {safeReviews.length} reviews
            </p>
          </div>

          {/* Rating Bars */}
          <div>
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                className="mb-2 flex items-center gap-2"
              >
                <span className="w-5 text-xs font-medium text-gray-500">
                  {star}
                </span>

                <Star
                  size={13}
                  className="fill-yellow-400 text-yellow-400"
                />

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{
                      width: `${ratingDistribution[star]}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="divide-y divide-gray-200">
        {safeReviews.map((review) => (
          <article
            key={review.id}
            className="py-6 first:pt-6 last:pb-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <UserRound
                    size={19}
                    className="text-gray-500"
                  />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {review.name}
                  </p>

                  <div className="mt-1">
                    <RatingStars
                      rating={review.rating}
                    />
                  </div>
                </div>
              </div>

              <span className="text-xs text-gray-400">
                {review.date}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              {review.comment}
            </p>

            <span className="mt-3 inline-block text-xs font-medium text-green-600">
              Verified purchase
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}