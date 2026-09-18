import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserToken } from "@/lib/auth";

import Review from "@/models/Review";
import Product from "@/models/Product";
import User from "@/models/User";

async function resolveProductId(productId) {
  if (!productId) {
    return null;
  }

  // Real MongoDB ObjectId
  if (
    mongoose.Types.ObjectId.isValid(productId)
  ) {
    const product = await Product.findById(
      productId
    )
      .select("_id")
      .lean();

    return product?._id || null;
  }

  // Support frontend numeric IDs such as /products/1
  if (/^\d+$/.test(String(productId))) {
    const numericId = Number(productId);

    if (numericId < 1) {
      return null;
    }

    const products = await Product.find({
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .select("_id")
      .lean();

    const product =
      products[numericId - 1];

    return product?._id || null;
  }

  return null;
}

/* -------------------------
   GET REVIEWS
------------------------- */

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const productId =
      searchParams.get("productId");

    const includeAll =
      searchParams.get("includeAll") ===
      "true";

    /* -------------------------
       ADMIN ALL REVIEWS
    ------------------------- */

    if (includeAll) {
      const token =
        getCurrentUserToken();

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Authentication required.",
          },
          { status: 401 }
        );
      }

      if (token.role !== "admin") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Admin access required.",
          },
          { status: 403 }
        );
      }

      const reviews =
        await Review.find({})
          .populate(
            "productId",
            "name slug images image price"
          )
          .sort({
            createdAt: -1,
          })
          .lean();

      return NextResponse.json({
        success: true,
        reviews,
        totalReviews:
          reviews.length,
      });
    }

    /* -------------------------
       PRODUCT REVIEWS
    ------------------------- */

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const resolvedProductId =
      await resolveProductId(
        productId
      );

    if (!resolvedProductId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    const reviews =
      await Review.find({
        productId:
          resolvedProductId,
        isApproved: true,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    const totalReviews =
      reviews.length;

    const totalRating =
      reviews.reduce(
        (sum, review) =>
          sum +
          Number(
            review.rating || 0
          ),
        0
      );

    const averageRating =
      totalReviews > 0
        ? Number(
            (
              totalRating /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach(
      (review) => {
        const rating =
          Number(
            review.rating
          );

        if (
          distribution[rating] !==
          undefined
        ) {
          distribution[rating] +=
            1;
        }
      }
    );

    return NextResponse.json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
      distribution,
    });
  } catch (error) {
    console.error(
      "GET reviews error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load reviews.",
      },
      { status: 500 }
    );
  }
}

/* -------------------------
   CREATE REVIEW
------------------------- */

export async function POST(request) {
  try {
    await connectDB();

    const token =
      getCurrentUserToken();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login before writing a review.",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const {
      productId,
      rating,
      title,
      comment,
    } = body;

    /* -------------------------
       VALIDATION
    ------------------------- */

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const resolvedProductId =
      await resolveProductId(
        productId
      );

    if (!resolvedProductId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    const numericRating =
      Number(rating);

    if (
      !Number.isInteger(
        numericRating
      ) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Rating must be between 1 and 5.",
        },
        { status: 400 }
      );
    }

    if (
      !title ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review title is required.",
        },
        { status: 400 }
      );
    }

    if (
      !comment ||
      !comment.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review comment is required.",
        },
        { status: 400 }
      );
    }

    /* -------------------------
       CHECK PRODUCT
    ------------------------- */

    const product =
      await Product.findById(
        resolvedProductId
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    /* -------------------------
       CHECK DUPLICATE REVIEW
    ------------------------- */

    const existingReview =
      await Review.findOne({
        productId:
          resolvedProductId,
        userId: token.userId,
      });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already reviewed this product.",
        },
        { status: 409 }
      );
    }

    /* -------------------------
       USER INFORMATION
    ------------------------- */

    let userName =
      token.email ||
      "Customer";

    let userEmail =
      token.email || "";

    if (
      token.userId &&
      mongoose.Types.ObjectId.isValid(
        token.userId
      )
    ) {
      const user =
        await User.findById(
          token.userId
        )
          .lean();

      if (user) {
        userName =
          `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim() ||
          user.email;

        userEmail =
          user.email ||
          userEmail;
      }
    }

    /* -------------------------
       CREATE REVIEW
    ------------------------- */

    const review =
      await Review.create({
        productId:
          resolvedProductId,
        userId:
          token.userId,
        userName,
        userEmail,
        rating:
          numericRating,
        title:
          title.trim(),
        comment:
          comment.trim(),
        isApproved: true,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Review submitted successfully.",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST review error:",
      error
    );

    if (
      error?.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already reviewed this product.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to submit review.",
      },
      { status: 500 }
    );
  }
}

/* -------------------------
   UPDATE REVIEW
   ADMIN ONLY
------------------------- */

export async function PATCH(request) {
  try {
    await connectDB();

    const token =
      getCurrentUserToken();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        { status: 401 }
      );
    }

    if (token.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body =
      await request.json();

    const {
      reviewId,
      isApproved,
    } = body;

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        reviewId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid review ID.",
        },
        { status: 400 }
      );
    }

    if (
      typeof isApproved !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "isApproved must be true or false.",
        },
        { status: 400 }
      );
    }

    const review =
      await Review.findByIdAndUpdate(
        reviewId,
        {
          isApproved,
        },
        {
          new: true,
        }
      )
        .populate(
          "productId",
          "name slug images image price"
        )
        .lean();

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isApproved
        ? "Review approved successfully."
        : "Review rejected successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "PATCH review error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update review.",
      },
      { status: 500 }
    );
  }
}

/* -------------------------
   DELETE REVIEW
------------------------- */

export async function DELETE(request) {
  try {
    await connectDB();

    const token =
      getCurrentUserToken();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const reviewId =
      searchParams.get(
        "reviewId"
      );

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        reviewId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid review ID.",
        },
        { status: 400 }
      );
    }

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review not found.",
        },
        { status: 404 }
      );
    }

    const isOwner =
      String(review.userId) ===
      String(token.userId);

    const isAdmin =
      token.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have permission to delete this review.",
        },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(
      reviewId
    );

    return NextResponse.json({
      success: true,
      message:
        "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE review error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete review.",
      },
      { status: 500 }
    );
  }
}