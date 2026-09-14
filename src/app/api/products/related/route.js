import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ProductReviews from "@/components/products/ProductsReviews";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(
      request.url
    );

    const productId =
      searchParams.get("productId");

    const categoryId =
      searchParams.get("categoryId");

    const category =
      searchParams.get("category");

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

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const product =
      await Product.findById(
        productId
      ).lean();

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
       BUILD RELATED QUERY
    ------------------------- */

    const orConditions = [];

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(
        categoryId
      )
    ) {
      orConditions.push({
        categoryId:
          new mongoose.Types.ObjectId(
            categoryId
          ),
      });
    }

    if (category) {
      orConditions.push({
        category: category,
      });
    }

    if (product.brand) {
      orConditions.push({
        brand: product.brand,
      });
    }

    if (product.subcategory) {
      orConditions.push({
        subcategory:
          product.subcategory,
      });
    }

    /* -------------------------
       BASE QUERY
    ------------------------- */

    const query = {
      _id: {
        $ne: product._id,
      },

      isActive: true,

      stock: {
        $gt: 0,
      },
    };

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    /* -------------------------
       FIND RELATED PRODUCTS
    ------------------------- */

    const relatedProducts =
      await Product.find(query)
        .sort({
          featured: -1,
          createdAt: -1,
        })
        .limit(8)
        .lean();

    /* -------------------------
       FORMAT PRODUCTS
    ------------------------- */

    const formattedProducts =
      relatedProducts.map(
        (item) => ({
          ...item,

          id:
            item._id?.toString(),

          image:
            item.image ||
            item.images?.[0] ||
            "",

          images:
            Array.isArray(
              item.images
            )
              ? item.images
              : item.image
                ? [item.image]
                : [],

          price: Number(
            item.price || 0
          ),

          oldPrice: Number(
            item.oldPrice || 0
          ),

          discount: Number(
            item.discount || 0
          ),

          stock: Number(
            item.stock || 0
          ),

          rating: Number(
            item.rating || 0
          ),

          reviews: Number(
            item.reviews || 0
          ),

          seller:
            item.sellerName ||
            item.seller ||
            "",

          category:
            item.category ||
            item.categoryId?.name ||
            "",
        })
      );

    return NextResponse.json({
      success: true,
      products:
        formattedProducts,
    });
  } catch (error) {
    console.error(
      "Related products error:",
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
  <ProductReviews
  productId={productId}
/>
}