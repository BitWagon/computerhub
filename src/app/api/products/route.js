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
  const baseSlug =
    createSlug(name) || `product-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = {
      slug,
    };

    if (
      excludeId &&
      mongoose.Types.ObjectId.isValid(excludeId)
    ) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existingProduct =
      await Product.findOne(query).lean();

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function calculateDiscount(price, oldPrice) {
  const currentPrice = Number(price) || 0;
  const previousPrice = Number(oldPrice) || 0;

  if (
    previousPrice <= 0 ||
    currentPrice <= 0 ||
    previousPrice <= currentPrice
  ) {
    return 0;
  }

  return Math.round(
    ((previousPrice - currentPrice) /
      previousPrice) *
      100
  );
}

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

/*
|--------------------------------------------------------------------------
| GET /api/products
|--------------------------------------------------------------------------
*/

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const includeInactive =
      searchParams.get("includeInactive") ===
      "true";

    const categoryId =
      searchParams.get("categoryId");

    const category =
      searchParams.get("category");

    const featured =
      searchParams.get("featured");

    const user =
      getCurrentUserToken();

    if (includeInactive) {
      if (!user || user.role !== "admin") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Admin access required.",
          },
          {
            status: 403,
          }
        );
      }
    }

    const query = {};

    if (!includeInactive) {
      query.isActive = true;
    }

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(
        categoryId
      )
    ) {
      query.categoryId = categoryId;
    }

    if (category && !categoryId) {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    const products =
      await Product.find(query)
        .populate(
          "categoryId",
          "name slug description image isActive"
        )
        .sort({
          featured: -1,
          createdAt: -1,
        })
        .lean();

    const formattedProducts =
      products.map((product) => {
        const images = normalizeImages(
          product.images
        );

        return {
          ...product,

          id: product._id.toString(),

          _id: product._id.toString(),

          image:
            images[0] || "",

          images,

          price:
            Number(product.price) || 0,

          oldPrice:
            Number(product.oldPrice) || 0,

          discount:
            Number(product.discount) ||
            calculateDiscount(
              product.price,
              product.oldPrice
            ),

          stock:
            Number(product.stock) || 0,

          categoryId:
            product.categoryId
              ? {
                  _id:
                    product.categoryId._id?.toString(),

                  name:
                    product.categoryId.name,

                  slug:
                    product.categoryId.slug,

                  description:
                    product.categoryId
                      .description || "",

                  image:
                    product.categoryId.image ||
                    "",

                  isActive:
                    product.categoryId.isActive,
                }
              : null,
        };
      });

    return NextResponse.json(
      {
        success: true,
        products: formattedProducts,
        count:
          formattedProducts.length,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load products.",
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

/*
|--------------------------------------------------------------------------
| POST /api/products
|--------------------------------------------------------------------------
|
| Seller or Admin can create products.
|
*/

export async function POST(request) {
  try {
    await connectDB();

    const user =
      getCurrentUserToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
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
            "Only sellers and admins can create products.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const {
      name,
      shortDescription,
      description,
      price,
      oldPrice,
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
    } = body;

    if (
      !name ||
      !String(name).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      price === undefined ||
      price === null ||
      Number.isNaN(Number(price))
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid product price is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    let finalCategoryId =
      categoryId || null;

    let finalCategory =
      category || "";

    if (
      finalCategoryId &&
      mongoose.Types.ObjectId.isValid(
        finalCategoryId
      )
    ) {
      const foundCategory =
        await Category.findById(
          finalCategoryId
        ).lean();

      if (!foundCategory) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected category was not found.",
          },
          {
            status: 400,
          }
        );
      }

      finalCategory =
        foundCategory.name;

      finalCategoryId =
        foundCategory._id;
    } else {
      finalCategoryId = null;
    }

    /*
    |--------------------------------------------------------------------------
    | Images
    |--------------------------------------------------------------------------
    */

    let finalImages =
      normalizeImages(images);

    if (
      finalImages.length === 0 &&
      image
    ) {
      finalImages =
        normalizeImages(image);
    }

    /*
    |--------------------------------------------------------------------------
    | Seller
    |--------------------------------------------------------------------------
    */

    let sellerId = null;
    let sellerName = "";

    if (user.role === "seller") {
      sellerId = user.userId;

      const seller =
        await User.findById(
          user.userId
        ).lean();

      if (seller) {
        sellerName =
          `${seller.firstName || ""} ${
            seller.lastName || ""
          }`.trim();
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Admin may optionally create for another seller
    |--------------------------------------------------------------------------
    */

    if (
      user.role === "admin" &&
      body.sellerId &&
      mongoose.Types.ObjectId.isValid(
        body.sellerId
      )
    ) {
      const seller =
        await User.findById(
          body.sellerId
        ).lean();

      if (
        seller &&
        seller.role === "seller"
      ) {
        sellerId = seller._id;

        sellerName =
          `${seller.firstName || ""} ${
            seller.lastName || ""
          }`.trim();
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SKU
    |--------------------------------------------------------------------------
    */

    let finalSku =
      String(sku || "")
        .trim()
        .toUpperCase();

    if (finalSku) {
      const existingSku =
        await Product.findOne({
          sku: finalSku,
        }).lean();

      if (existingSku) {
        return NextResponse.json(
          {
            success: false,
            message:
              "SKU already exists.",
          },
          {
            status: 400,
          }
        );
      }
    } else {
      let generatedSku = "";
      let skuExists = true;

      while (skuExists) {
        const randomPart =
          Math.floor(
            1000 +
              Math.random() * 9000
          );

        generatedSku =
          `CH-${Date.now()}-${randomPart}`;

        const existingProduct =
          await Product.findOne({
            sku: generatedSku,
          }).lean();

        skuExists =
          Boolean(existingProduct);
      }

      finalSku = generatedSku;
    }

    /*
    |--------------------------------------------------------------------------
    | Slug
    |--------------------------------------------------------------------------
    */

    const slug =
      await createUniqueSlug(
        name
      );

    const numericPrice =
      Number(price) || 0;

    const numericOldPrice =
      Number(oldPrice) || 0;

    const discount =
      calculateDiscount(
        numericPrice,
        numericOldPrice
      );

    /*
    |--------------------------------------------------------------------------
    | Create product
    |--------------------------------------------------------------------------
    */

    const product =
      await Product.create({
        name:
          String(name).trim(),

        slug,

        shortDescription:
          shortDescription || "",

        description:
          description || "",

        price:
          numericPrice,

        oldPrice:
          numericOldPrice,

        discount,

        stock:
          Number(stock) || 0,

        sku:
          finalSku || undefined,

        brand:
          brand || "",

        category:
          finalCategory,

        categoryId:
          finalCategoryId,

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

        sellerId,

        sellerName,
      });

    return NextResponse.json(
      {
        success: true,

        message:
          "Product created successfully.",

        product: {
          ...product.toObject(),

          id:
            product._id.toString(),

          _id:
            product._id.toString(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/products error:",
      error
    );

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with the same unique value already exists.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create product.",
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

/*
|--------------------------------------------------------------------------
| PATCH /api/products
|--------------------------------------------------------------------------
|
| Seller:
|   Can update own products.
|
| Admin:
|   Can update any product.
|
*/

export async function PATCH(request) {
  try {
    await connectDB();

    const user =
      getCurrentUserToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const productId =
      body.id ||
      body.productId ||
      body._id;

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Seller ownership
    |--------------------------------------------------------------------------
    */

    if (user.role === "seller") {
      if (
        !product.sellerId ||
        String(product.sellerId) !==
          String(user.userId)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You can only edit your own products.",
          },
          {
            status: 403,
          }
        );
      }
    } else if (
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to update products.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Product fields
    |--------------------------------------------------------------------------
    */

    const allowedFields = [
      "name",
      "shortDescription",
      "description",
      "price",
      "oldPrice",
      "stock",
      "sku",
      "brand",
      "category",
      "categoryId",
      "subcategory",
      "processor",
      "ram",
      "storage",
      "graphics",
      "screenSize",
      "images",
      "featured",
      "freeDelivery",
      "isActive",
      "sellerId",
      "sellerName",
    ];

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        if (
          user.role === "seller" &&
          field === "sellerId"
        ) {
          continue;
        }

        product[field] =
          body[field];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Category handling
    |--------------------------------------------------------------------------
    */

    if (
      body.categoryId &&
      mongoose.Types.ObjectId.isValid(
        body.categoryId
      )
    ) {
      const foundCategory =
        await Category.findById(
          body.categoryId
        ).lean();

      if (!foundCategory) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected category was not found.",
          },
          {
            status: 400,
          }
        );
      }

      product.categoryId =
        foundCategory._id;

      product.category =
        foundCategory.name;
    } else if (
      body.categoryId === null ||
      body.categoryId === ""
    ) {
      product.categoryId =
        null;
    }

    /*
    |--------------------------------------------------------------------------
    | Images
    |--------------------------------------------------------------------------
    */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "images"
      )
    ) {
      product.images =
        normalizeImages(
          body.images
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SKU
    |--------------------------------------------------------------------------
    */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "sku"
      )
    ) {
      const newSku =
        String(
          body.sku || ""
        )
          .trim()
          .toUpperCase();

      if (newSku) {
        const duplicateSku =
          await Product.findOne({
            sku: newSku,
            _id: {
              $ne: product._id,
            },
          }).lean();

        if (duplicateSku) {
          return NextResponse.json(
            {
              success: false,
              message:
                "SKU already exists.",
            },
            {
              status: 400,
            }
          );
        }

        product.sku =
          newSku;
      } else {
        product.sku =
          undefined;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Slug
    |--------------------------------------------------------------------------
    */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "name"
      ) &&
      body.name
    ) {
      product.slug =
        await createUniqueSlug(
          body.name,
          product._id.toString()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Discount
    |--------------------------------------------------------------------------
    */

    product.discount =
      calculateDiscount(
        product.price,
        product.oldPrice
      );

    /*
    |--------------------------------------------------------------------------
    | Seller repair
    |--------------------------------------------------------------------------
    */

    if (
      user.role === "admin" &&
      !product.sellerId &&
      body.sellerId &&
      mongoose.Types.ObjectId.isValid(
        body.sellerId
      )
    ) {
      const seller =
        await User.findById(
          body.sellerId
        ).lean();

      if (
        seller &&
        seller.role === "seller"
      ) {
        product.sellerId =
          seller._id;

        product.sellerName =
          `${seller.firstName || ""} ${
            seller.lastName || ""
          }`.trim();
      }
    }

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Product updated successfully.",
        product: {
          ...product.toObject(),
          id:
            product._id.toString(),
          _id:
            product._id.toString(),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/products error:",
      error
    );

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with the same unique value already exists.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update product.",
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

/*
|--------------------------------------------------------------------------
| DELETE /api/products
|--------------------------------------------------------------------------
|
| Permanent delete:
| Only INACTIVE products can be permanently deleted.
|
*/

export async function DELETE(request) {
  try {
    await connectDB();

    const user =
      getCurrentUserToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const productId =
      searchParams.get("id") ||
      searchParams.get("productId");

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Seller ownership
    |--------------------------------------------------------------------------
    */

    if (user.role === "seller") {
      if (
        !product.sellerId ||
        String(product.sellerId) !==
          String(user.userId)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You can only delete your own products.",
          },
          {
            status: 403,
          }
        );
      }
    } else if (
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

    /*
    |--------------------------------------------------------------------------
    | Only inactive products can be permanently deleted
    |--------------------------------------------------------------------------
    */

    if (product.isActive !== false) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only inactive products can be permanently deleted. Please deactivate the product first.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Permanent delete
    |--------------------------------------------------------------------------
    */

    await Product.findByIdAndDelete(
      productId
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Product permanently deleted successfully.",
        productId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to permanently delete product.",
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