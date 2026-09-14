import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    let product = null;

    /*
    |--------------------------------------------------------------------------
    | 1. Try MongoDB ObjectId
    |--------------------------------------------------------------------------
    */

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id)
        .populate(
          "categoryId",
          "name slug description image isActive"
        )
        .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Backward compatibility for numeric product IDs
    |--------------------------------------------------------------------------
    |
    | Your older Products page used IDs such as:
    |
    | /products/1
    | /products/2
    | /products/9
    | /products/12
    |
    | Those are NOT MongoDB ObjectIds.
    |
    | If a numeric ID is received, we map it to the
    | corresponding active product.
    |
    */

    if (!product && /^\d+$/.test(id)) {
      const numericId = Number(id);

      if (numericId > 0) {
        const products = await Product.find({
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

        /*
        | Numeric IDs are treated as 1-based positions.
        |
        | Example:
        | /products/1  -> first product
        | /products/2  -> second product
        | /products/12 -> twelfth product
        */

        if (
          numericId <= products.length
        ) {
          product =
            products[numericId - 1];
        }
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Product not found
    |--------------------------------------------------------------------------
    */

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize images
    |--------------------------------------------------------------------------
    */

    let images = [];

    if (Array.isArray(product.images)) {
      images = product.images
        .map((image) =>
          String(image || "").trim()
        )
        .filter(Boolean);
    } else if (
      typeof product.images === "string"
    ) {
      images = product.images
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean);
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize price
    |--------------------------------------------------------------------------
    */

    const price =
      Number(product.price) || 0;

    const oldPrice =
      Number(product.oldPrice) || 0;

    /*
    |--------------------------------------------------------------------------
    | Calculate discount if needed
    |--------------------------------------------------------------------------
    */

    let discount =
      Number(product.discount) || 0;

    if (
      discount === 0 &&
      oldPrice > price &&
      oldPrice > 0
    ) {
      discount = Math.round(
        ((oldPrice - price) /
          oldPrice) *
          100
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Return clean product
    |--------------------------------------------------------------------------
    */

    const formattedProduct = {
      ...product,

      _id: product._id
        ? product._id.toString()
        : null,

      id: product._id
        ? product._id.toString()
        : null,

      categoryId:
        product.categoryId
          ? {
              _id:
                product.categoryId._id
                  ? product.categoryId._id.toString()
                  : null,

              name:
                product.categoryId.name ||
                "",

              slug:
                product.categoryId.slug ||
                "",

              description:
                product.categoryId.description ||
                "",

              image:
                product.categoryId.image ||
                "",

              isActive:
                product.categoryId.isActive ??
                true,
            }
          : null,

      images,

      image:
        images.length > 0
          ? images[0]
          : "",

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
    };

    return NextResponse.json(
      {
        success: true,
        product: formattedProduct,
      },
      {
        status: 200,
      }
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
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}