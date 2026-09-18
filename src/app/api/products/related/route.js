import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

async function resolveProduct(productId) {
  if (!productId) {
    return null;
  }

  // Normal MongoDB ObjectId
  if (
    mongoose.Types.ObjectId.isValid(productId)
  ) {
    return await Product.findById(
      productId
    ).lean();
  }

  // Support frontend numeric IDs
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
      .lean();

    return products[numericId - 1] || null;
  }

  return null;
}

function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  const images = Array.isArray(
    product.images
  )
    ? product.images.filter(Boolean)
    : [];

  const image =
    product.image ||
    images[0] ||
    "";

  return {
    ...product,

    id: product._id
      ? product._id.toString()
      : product.id,

    _id: product._id
      ? product._id.toString()
      : product._id,

    categoryId:
      product.categoryId
        ? product.categoryId.toString()
        : null,

    sellerId:
      product.sellerId
        ? product.sellerId.toString()
        : null,

    images,

    image,

    price: Number(
      product.price || 0
    ),

    oldPrice: Number(
      product.oldPrice || 0
    ),

    discount: Number(
      product.discount || 0
    ),

    stock: Number(
      product.stock || 0
    ),

    featured: Boolean(
      product.featured
    ),

    freeDelivery: Boolean(
      product.freeDelivery
    ),

    isActive: Boolean(
      product.isActive
    ),
  };
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const productId =
      searchParams.get(
        "productId"
      );

    const category =
      searchParams.get(
        "category"
      );

    const categoryId =
      searchParams.get(
        "categoryId"
      );

    const brand =
      searchParams.get(
        "brand"
      );

    const subcategory =
      searchParams.get(
        "subcategory"
      );

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

    const currentProduct =
      await resolveProduct(
        productId
      );

    if (!currentProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Build related-product conditions.
     *
     * We support:
     * - categoryId
     * - category
     * - brand
     * - subcategory
     */

    const orConditions = [];

    if (
      currentProduct.categoryId
    ) {
      orConditions.push({
        categoryId:
          currentProduct.categoryId,
      });
    }

    if (
      currentProduct.category
    ) {
      orConditions.push({
        category:
          currentProduct.category,
      });
    }

    if (
      currentProduct.brand
    ) {
      orConditions.push({
        brand:
          currentProduct.brand,
      });
    }

    if (
      currentProduct.subcategory
    ) {
      orConditions.push({
        subcategory:
          currentProduct.subcategory,
      });
    }

    /*
     * Also accept values sent by
     * the frontend.
     */

    if (
      category &&
      !orConditions.some(
        (condition) =>
          condition.category ===
          category
      )
    ) {
      orConditions.push({
        category,
      });
    }

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(
        categoryId
      )
    ) {
      orConditions.push({
        categoryId:
          categoryId,
      });
    }

    if (
      brand &&
      !orConditions.some(
        (condition) =>
          condition.brand ===
          brand
      )
    ) {
      orConditions.push({
        brand,
      });
    }

    if (
      subcategory &&
      !orConditions.some(
        (condition) =>
          condition.subcategory ===
          subcategory
      )
    ) {
      orConditions.push({
        subcategory,
      });
    }

    /*
     * If there is no category/brand/
     * subcategory information, return
     * other active products instead
     * of throwing a 400 error.
     */

    const query = {
      isActive: true,
      stock: {
        $gt: 0,
      },
    };

    /*
     * Exclude current product.
     */

    if (
      currentProduct._id
    ) {
      query._id = {
        $ne: currentProduct._id,
      };
    }

    /*
     * Only add $or when we actually
     * have related fields.
     */

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    let relatedProducts =
      await Product.find(query)
        .sort({
          featured: -1,
          createdAt: -1,
        })
        .limit(8)
        .lean();

    /*
     * If there are fewer than 4 related
     * products, fill the remaining slots
     * with other active products.
     */

    if (
      relatedProducts.length < 4
    ) {
      const existingIds =
        relatedProducts.map(
          (product) =>
            product._id
        );

      if (
        currentProduct._id
      ) {
        existingIds.push(
          currentProduct._id
        );
      }

      const fallbackProducts =
        await Product.find({
          isActive: true,
          stock: {
            $gt: 0,
          },
          _id: {
            $nin: existingIds,
          },
        })
          .sort({
            featured: -1,
            createdAt: -1,
          })
          .limit(
            8 -
              relatedProducts.length
          )
          .lean();

      relatedProducts = [
        ...relatedProducts,
        ...fallbackProducts,
      ];
    }

    const formattedProducts =
      relatedProducts.map(
        normalizeProduct
      );

    return NextResponse.json({
      success: true,
      products:
        formattedProducts,
      count:
        formattedProducts.length,
    });
  } catch (error) {
    console.error(
      "GET related products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load related products.",
      },
      { status: 500 }
    );
  }
}