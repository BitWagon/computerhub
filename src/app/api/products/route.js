import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserToken } from "@/lib/auth";

import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(name, excludeId = null) {
  const baseSlug = createSlug(name) || `product-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existingProduct = await Product.findOne(query).lean();

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function getUser() {
  return getCurrentUserToken();
}

async function validateCategory(categoryId) {
  if (!categoryId) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID.");
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  }).lean();

  if (!category) {
    throw new Error("Selected category does not exist or is inactive.");
  }

  return category;
}

/*
|--------------------------------------------------------------------------
| GET PRODUCTS
|--------------------------------------------------------------------------
*/

export async function GET(request) {
  try {
    await connectDB();

    const user = getUser();

    const { searchParams } = new URL(request.url);

    const includeInactive =
      searchParams.get("includeInactive") === "true";

    const featured =
      searchParams.get("featured") === "true";

    const categoryId =
      searchParams.get("categoryId");

    const sellerId =
      searchParams.get("sellerId");

    const id =
      searchParams.get("id");

    const query = {};

    /*
     * Single product
     */
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product ID.",
          },
          {
            status: 400,
          }
        );
      }

      const product = await Product.findById(id)
        .populate("categoryId")
        .lean();

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

      return NextResponse.json({
        success: true,
        product,
      });
    }

    /*
     * Public users only see active products.
     */
    if (!user || user.role !== "admin") {
      query.isActive = true;
    } else if (!includeInactive) {
      query.isActive = true;
    }

    /*
     * Category filter
     */
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category ID.",
          },
          {
            status: 400,
          }
        );
      }

      query.categoryId = categoryId;
    }

    /*
     * Featured products
     */
    if (featured) {
      query.featured = true;
    }

    /*
     * Seller filtering
     */
    if (sellerId) {
      if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid seller ID.",
          },
          {
            status: 400,
          }
        );
      }

      query.sellerId = sellerId;
    }

    /*
     * Seller dashboard:
     * seller only sees their own products.
     */
    if (user?.role === "seller") {
      query.sellerId = user.userId;
    }

    const products = await Product.find(query)
      .populate("categoryId")
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch products.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST PRODUCT
|--------------------------------------------------------------------------
*/

export async function POST(request) {
  try {
    await connectDB();

    const user = getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      user.role !== "seller" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to create products.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      shortDescription,
      description,
      price,
      oldPrice,
      originalPrice,
      discount,
      stock,
      sku,
      brand,
      category,
      categoryId,
      subcategory,
      processor,
      ram,
      storage,
      graphics,
      screenSize,
      images,
      image,
      featured,
      freeDelivery,
      isActive,
      sellerId,
      sellerName,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product price is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate category when supplied.
     */
    let selectedCategory = null;

    if (categoryId) {
      try {
        selectedCategory =
          await validateCategory(categoryId);
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * Seller ID must come from JWT for sellers.
     */
    let finalSellerId = user.userId;
    let finalSellerName = sellerName || "";

    /*
     * Admin can create a product for a seller.
     */
    if (user.role === "admin" && sellerId) {
      if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid seller ID.",
          },
          {
            status: 400,
          }
        );
      }

      const seller = await User.findById(sellerId).lean();

      if (!seller) {
        return NextResponse.json(
          {
            success: false,
            message: "Seller not found.",
          },
          {
            status: 404,
          }
        );
      }

      finalSellerId = seller._id;
      finalSellerName =
        `${seller.firstName || ""} ${seller.lastName || ""}`.trim();
    } else {
      const seller = await User.findById(user.userId).lean();

      if (seller) {
        finalSellerName =
          `${seller.firstName || ""} ${seller.lastName || ""}`.trim();
      }
    }

    /*
     * Handle image field from the existing seller form.
     */
    let finalImages = [];

    if (Array.isArray(images)) {
      finalImages = images.filter(Boolean);
    } else if (image) {
      finalImages = [image];
    }

    const finalSlug = await createUniqueSlug(
      slug || name
    );

    /*
     * Support both oldPrice and originalPrice.
     */
    const finalOldPrice =
      oldPrice !== undefined &&
      oldPrice !== null &&
      oldPrice !== ""
        ? Number(oldPrice)
        : originalPrice !== undefined &&
            originalPrice !== null &&
            originalPrice !== ""
          ? Number(originalPrice)
          : null;

    /*
     * If categoryId exists, store the category name
     * in the old category field as well.
     */
    const finalCategory =
      selectedCategory?.name ||
      category ||
      "";

    const productData = {
      name: String(name).trim(),

      slug: finalSlug,

      shortDescription:
        shortDescription || "",

      description:
        description || "",

      price: Number(price),

      oldPrice:
        finalOldPrice !== null &&
        !Number.isNaN(finalOldPrice)
          ? finalOldPrice
          : null,

      discount:
        discount !== undefined &&
        discount !== null &&
        discount !== ""
          ? Number(discount)
          : 0,

      stock:
        stock !== undefined &&
        stock !== null &&
        stock !== ""
          ? Number(stock)
          : 0,

      sku:
        sku
          ? String(sku).trim().toUpperCase()
          : undefined,

      brand:
        brand || "",

      category:
        finalCategory,

      categoryId:
        selectedCategory?._id || null,

      subcategory:
        subcategory || "",

      processor:
        processor || "",

      ram:
        ram || "",

      storage:
        storage || "",

      graphics:
        graphics || "",

      screenSize:
        screenSize || "",

      images:
        finalImages,

      featured:
        Boolean(featured),

      freeDelivery:
        Boolean(freeDelivery),

      isActive:
        isActive === undefined
          ? true
          : Boolean(isActive),

      sellerId:
        finalSellerId,

      sellerName:
        finalSellerName,
    };

    const product =
      await Product.create(productData);

    const populatedProduct =
      await Product.findById(product._id)
        .populate("categoryId")
        .lean();

    console.log(
      "✅ Product created:",
      populatedProduct._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product: populatedProduct,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with the same slug or SKU already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to create product.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH PRODUCT
|--------------------------------------------------------------------------
*/

export async function PATCH(request) {
  try {
    await connectDB();

    const user = getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const productId =
      body.id ||
      body.productId ||
      body._id;

    if (!productId) {
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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await Product.findById(productId);

    if (!existingProduct) {
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
     * Sellers can only edit their own products.
     */
    if (
      user.role === "seller" &&
      String(existingProduct.sellerId) !==
        String(user.userId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to edit this product.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      user.role !== "seller" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to edit products.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Category update.
     */
    if (body.categoryId !== undefined) {
      if (body.categoryId === "" || body.categoryId === null) {
        existingProduct.categoryId = null;
        existingProduct.category =
          body.category || "";
      } else {
        try {
          const selectedCategory =
            await validateCategory(
              body.categoryId
            );

          existingProduct.categoryId =
            selectedCategory._id;

          existingProduct.category =
            selectedCategory.name;
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              message: error.message,
            },
            {
              status: 400,
            }
          );
        }
      }
    } else if (body.category !== undefined) {
      existingProduct.category =
        body.category || "";
    }

    /*
     * Update normal fields only when supplied.
     */
    const fields = [
      "name",
      "shortDescription",
      "description",
      "brand",
      "subcategory",
      "processor",
      "ram",
      "storage",
      "graphics",
      "screenSize",
      "sellerName",
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        existingProduct[field] =
          body[field];
      }
    }

    if (body.price !== undefined) {
      existingProduct.price =
        Number(body.price);
    }

    if (body.oldPrice !== undefined) {
      existingProduct.oldPrice =
        body.oldPrice === "" ||
        body.oldPrice === null
          ? null
          : Number(body.oldPrice);
    } else if (
      body.originalPrice !== undefined
    ) {
      existingProduct.oldPrice =
        body.originalPrice === "" ||
        body.originalPrice === null
          ? null
          : Number(body.originalPrice);
    }

    if (body.discount !== undefined) {
      existingProduct.discount =
        Number(body.discount);
    }

    if (body.stock !== undefined) {
      existingProduct.stock =
        Number(body.stock);
    }

    if (body.sku !== undefined) {
      existingProduct.sku =
        body.sku
          ? String(body.sku)
              .trim()
              .toUpperCase()
          : undefined;
    }

    if (Array.isArray(body.images)) {
      existingProduct.images =
        body.images.filter(Boolean);
    } else if (
      body.image !== undefined
    ) {
      existingProduct.images =
        body.image
          ? [body.image]
          : [];
    }

    if (body.featured !== undefined) {
      existingProduct.featured =
        Boolean(body.featured);
    }

    if (body.freeDelivery !== undefined) {
      existingProduct.freeDelivery =
        Boolean(body.freeDelivery);
    }

    if (body.isActive !== undefined) {
      existingProduct.isActive =
        Boolean(body.isActive);
    }

    /*
     * Allow admin to repair missing sellerId.
     * Existing sellerId is ALWAYS preserved otherwise.
     */
    if (
      user.role === "admin" &&
      body.sellerId
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          body.sellerId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid seller ID.",
          },
          {
            status: 400,
          }
        );
      }

      const seller =
        await User.findById(
          body.sellerId
        ).lean();

      if (!seller) {
        return NextResponse.json(
          {
            success: false,
            message: "Seller not found.",
          },
          {
            status: 404,
          }
        );
      }

      existingProduct.sellerId =
        seller._id;

      existingProduct.sellerName =
        `${seller.firstName || ""} ${seller.lastName || ""}`.trim();
    }

    /*
     * Update slug only when name or slug changes.
     */
    if (
      body.slug !== undefined ||
      body.name !== undefined
    ) {
      existingProduct.slug =
        await createUniqueSlug(
          body.slug || existingProduct.name,
          existingProduct._id
        );
    }

    await existingProduct.save();

    const populatedProduct =
      await Product.findById(
        existingProduct._id
      )
        .populate("categoryId")
        .lean();

    console.log(
      "✅ Product updated:",
      existingProduct._id.toString()
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("PATCH /api/products error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with the same slug or SKU already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to update product.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export async function DELETE(request) {
  try {
    await connectDB();

    const user = getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      user.role !== "seller" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to delete products.",
        },
        {
          status: 403,
        }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const productId =
      searchParams.get("id") ||
      searchParams.get("productId");

    if (!productId) {
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

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.findById(productId);

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

    if (
      user.role === "seller" &&
      String(product.sellerId) !==
        String(user.userId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to delete this product.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Soft delete.
     */
    product.isActive = false;

    await product.save();

    console.log(
      "✅ Product deactivated:",
      product._id.toString()
    );

    return NextResponse.json({
      success: true,
      message: "Product deactivated successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}