import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserToken } from "@/lib/auth";

import Product from "@/models/Product";

function normalizeImages(images) {
  if (Array.isArray(images)) {
    return images
      .map((image) => String(image || "").trim())
      .filter(Boolean);
  }

  if (typeof images === "string") {
    return images
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
}

function calculateDiscount(price, oldPrice) {
  if (
    oldPrice <= 0 ||
    price <= 0 ||
    oldPrice <= price
  ) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}

export async function GET(
  request,
  { params }
) {
  try {
    await connectDB();

    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const user =
      getCurrentUserToken();

    let product = null;

    /*
    |--------------------------------------------------------------------------
    | MongoDB ObjectId
    |--------------------------------------------------------------------------
    */

    if (mongoose.Types.ObjectId.isValid(id)) {
      product =
        await Product.findById(id)
          .populate(
            "categoryId",
            "name slug description image isActive"
          )
          .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | Legacy numeric IDs
    |--------------------------------------------------------------------------
    */

    if (
      !product &&
      /^\d+$/.test(id)
    ) {
      const numericId = Number(id);

      if (numericId > 0) {
        const products =
          await Product.find({
            isActive: true,
          })
            .populate(
              "categoryId",
              "name slug description image isActive"
            )
            .sort({
              createdAt: -1,
            })
            .lean();

        if (
          numericId <= products.length
        ) {
          product =
            products[numericId - 1];
        }
      }
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Protect inactive products
    |--------------------------------------------------------------------------
    */

    if (product.isActive === false) {
      const isAdmin =
        user?.role === "admin";

      const isOwner =
        user?.role === "seller" &&
        product.sellerId &&
        String(product.sellerId) ===
          String(user.userId);

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          {
            success: false,
            message: "Product not found.",
          },
          { status: 404 }
        );
      }
    }

    const images =
      normalizeImages(product.images);

    const price =
      Number(product.price) || 0;

    const oldPrice =
      Number(product.oldPrice) || 0;

    let discount =
      Number(product.discount) || 0;

    if (
      discount === 0 &&
      oldPrice > price
    ) {
      discount =
        calculateDiscount(
          price,
          oldPrice
        );
    }

    const formattedProduct = {
      ...product,

      _id: product._id
        ? product._id.toString()
        : null,

      id: product._id
        ? product._id.toString()
        : null,

      images,

      image:
        images[0] || "",

      price,

      oldPrice,

      discount,

      stock:
        Number(product.stock) || 0,

      featured:
        Boolean(product.featured),

      freeDelivery:
        Boolean(product.freeDelivery),

      isActive:
        product.isActive !== false,

      sellerId:
        product.sellerId
          ? product.sellerId.toString()
          : null,

      categoryId:
        product.categoryId
          ? {
              _id:
                product.categoryId._id
                  ? product.categoryId._id.toString()
                  : null,

              name:
                product.categoryId.name || "",

              slug:
                product.categoryId.slug || "",

              description:
                product.categoryId.description || "",

              image:
                product.categoryId.image || "",

              isActive:
                product.categoryId.isActive !==
                false,
            }
          : null,
    };

    return NextResponse.json(
      {
        success: true,
        product: formattedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load product.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}