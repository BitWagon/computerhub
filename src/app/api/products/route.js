import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserToken } from "@/lib/auth";

import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";

/* =========================================================
   HELPERS
========================================================= */

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(
  name,
  excludeId = null
) {
  const baseSlug =
    createSlug(name) ||
    `product-${Date.now()}`;

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = {
      slug,
    };

    if (
      excludeId &&
      mongoose.Types.ObjectId.isValid(
        excludeId
      )
    ) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existing =
      await Product.findOne(query)
        .select("_id")
        .lean();

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function calculateDiscount(
  price,
  oldPrice
) {
  const currentPrice =
    Number(price) || 0;

  const originalPrice =
    Number(oldPrice) || 0;

  if (
    currentPrice <= 0 ||
    originalPrice <= 0 ||
    originalPrice <= currentPrice
  ) {
    return 0;
  }

  return Math.round(
    ((originalPrice - currentPrice) /
      originalPrice) *
      100
  );
}

function normalizeImages(images) {
  if (Array.isArray(images)) {
    return images
      .map((image) =>
        String(image || "").trim()
      )
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

function formatProduct(product) {
  const images = normalizeImages(
    product.images
  );

  const price =
    Number(product.price) || 0;

  const oldPrice =
    Number(product.oldPrice) || 0;

  const storedDiscount =
    Number(product.discount) || 0;

  const discount =
    storedDiscount > 0
      ? storedDiscount
      : calculateDiscount(
          price,
          oldPrice
        );

  return {
    ...product,

    id: product._id
      ? product._id.toString()
      : null,

    _id: product._id
      ? product._id.toString()
      : null,

    image:
      images[0] || "",

    images,

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
      product.categoryId &&
      typeof product.categoryId ===
        "object"
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
              product.categoryId
                .description || "",

            image:
              product.categoryId.image ||
              "",

            isActive:
              product.categoryId
                .isActive !== false,
          }
        : product.categoryId
        ? product.categoryId.toString()
        : null,
  };
}

/* =========================================================
   GET /api/products

   PUBLIC:
   - Active products

   ADMIN:
   - Can request inactive products too
========================================================= */

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const includeInactive =
      searchParams.get(
        "includeInactive"
      ) === "true";

    const categoryId =
      searchParams.get(
        "categoryId"
      );

    const category =
      searchParams.get(
        "category"
      );

    const featured =
      searchParams.get(
        "featured"
      );

    const user =
      getCurrentUserToken();

    /* =====================================================
       ONLY ADMIN CAN REQUEST INACTIVE PRODUCTS
    ===================================================== */

    if (includeInactive) {
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Authentication required.",
          },
          {
            status: 401,
          }
        );
      }

      if (user.role !== "admin") {
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

    /* =====================================================
       PUBLIC USERS SEE ONLY ACTIVE PRODUCTS
    ===================================================== */

    if (!includeInactive) {
      query.isActive = true;
    }

    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(
        categoryId
      )
    ) {
      query.categoryId =
        categoryId;
    } else if (category) {
      query.category =
        category;
    }

    /* =====================================================
       FEATURED FILTER
    ===================================================== */

    if (featured === "true") {
      query.featured = true;
    }

    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

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
      products.map(
        formatProduct
      );

    return NextResponse.json(
      {
        success: true,
        products:
          formattedProducts,
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

/* =========================================================
   POST /api/products

   ADMIN ONLY
========================================================= */

export async function POST(request) {
  try {
    await connectDB();

    const user =
      getCurrentUserToken();

    /* =====================================================
       LOGIN REQUIRED
    ===================================================== */

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

    /* =====================================================
       ADMIN ONLY
    ===================================================== */

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only administrators can create products.",
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
      sellerId,
    } = body;

    /* =====================================================
       REQUIRED PRODUCT NAME
    ===================================================== */

    if (
      !String(name || "").trim()
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

    /* =====================================================
       REQUIRED PRICE
    ===================================================== */

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

    /* =====================================================
       CATEGORY
    ===================================================== */

    let finalCategoryId =
      null;

    let finalCategory =
      String(category || "").trim();

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(
        categoryId
      )
    ) {
      const foundCategory =
        await Category.findById(
          categoryId
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

      finalCategoryId =
        foundCategory._id;

      finalCategory =
        foundCategory.name;
    }

    /* =====================================================
       IMAGES
    ===================================================== */

    let finalImages =
      normalizeImages(
        images
      );

    if (
      finalImages.length === 0 &&
      image
    ) {
      finalImages =
        normalizeImages(
          image
        );
    }

    /* =====================================================
       OPTIONAL SELLER ASSIGNMENT

       ADMIN MAY ASSIGN A PRODUCT TO A SELLER.

       BUT THE SELLER CANNOT CREATE OR EDIT IT.
    ===================================================== */

    let finalSellerId =
      null;

    let finalSellerName =
      "";

    if (sellerId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          sellerId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid seller ID.",
          },
          {
            status: 400,
          }
        );
      }

      const seller =
        await User.findById(
          sellerId
        )
          .select(
            "firstName lastName role isActive"
          )
          .lean();

      if (
        !seller ||
        seller.role !== "seller"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected seller was not found.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        seller.isActive === false
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected seller is inactive.",
          },
          {
            status: 400,
          }
        );
      }

      finalSellerId =
        seller._id;

      finalSellerName =
        `${seller.firstName || ""} ${
          seller.lastName || ""
        }`.trim();
    }

    /* =====================================================
       SKU
    ===================================================== */

    let finalSku =
      String(sku || "")
        .trim()
        .toUpperCase();

    if (finalSku) {
      const existingSku =
        await Product.findOne({
          sku: finalSku,
        })
          .select("_id")
          .lean();

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
      let skuExists = true;

      while (skuExists) {
        finalSku =
          `CH-${Date.now()}-${Math.floor(
            1000 +
              Math.random() * 9000
          )}`;

        const existing =
          await Product.findOne({
            sku: finalSku,
          })
            .select("_id")
            .lean();

        skuExists =
          Boolean(existing);
      }
    }

    /* =====================================================
       SLUG
    ===================================================== */

    const slug =
      await createUniqueSlug(
        name
      );

    /* =====================================================
       PRICE / DISCOUNT
    ===================================================== */

    const numericPrice =
      Number(price) || 0;

    const numericOldPrice =
      Number(oldPrice) || 0;

    const discount =
      calculateDiscount(
        numericPrice,
        numericOldPrice
      );

    /* =====================================================
       CREATE PRODUCT
    ===================================================== */

    const product =
      await Product.create({
        name:
          String(name).trim(),

        slug,

        shortDescription:
          String(
            shortDescription || ""
          ).trim(),

        description:
          String(
            description || ""
          ).trim(),

        price:
          numericPrice,

        oldPrice:
          numericOldPrice,

        discount,

        stock: Math.max(
          0,
          Number(stock) || 0
        ),

        sku:
          finalSku,

        brand:
          String(
            brand || ""
          ).trim(),

        category:
          finalCategory,

        categoryId:
          finalCategoryId,

        subcategory:
          String(
            subcategory || ""
          ).trim(),

        processor:
          String(
            processor || ""
          ).trim(),

        ram:
          String(
            ram || ""
          ).trim(),

        storage:
          String(
            storage || ""
          ).trim(),

        graphics:
          String(
            graphics || ""
          ).trim(),

        screenSize:
          String(
            screenSize || ""
          ).trim(),

        images:
          finalImages,

        featured:
          Boolean(featured),

        freeDelivery:
          Boolean(
            freeDelivery
          ),

        isActive:
          isActive === undefined
            ? true
            : Boolean(isActive),

        sellerId:
          finalSellerId,

        sellerName:
          finalSellerName,
      });

    return NextResponse.json(
      {
        success: true,

        message:
          "Product created successfully.",

        product:
          formatProduct(
            product.toObject()
          ),
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

    if (
      error.code === 11000
    ) {
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

/* =========================================================
   PATCH /api/products

   ADMIN ONLY
========================================================= */

export async function PATCH(request) {
  try {
    await connectDB();

    const user =
      getCurrentUserToken();

    /* =====================================================
       LOGIN REQUIRED
    ===================================================== */

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

    /* =====================================================
       ADMIN ONLY
    ===================================================== */

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only administrators can update products.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const productId =
      body.productId ||
      body.id ||
      body._id;

    /* =====================================================
       VALIDATE PRODUCT ID
    ===================================================== */

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

    /* =====================================================
       UPDATE ALLOWED FIELDS
    ===================================================== */

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
    ];

    for (
      const field of allowedFields
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        product[field] =
          body[field];
      }
    }

    /* =====================================================
       CATEGORY
    ===================================================== */

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
    }

    if (
      body.categoryId === null ||
      body.categoryId === ""
    ) {
      product.categoryId =
        null;
    }

    /* =====================================================
       IMAGES
    ===================================================== */

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

    /* =====================================================
       SKU
    ===================================================== */

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
              $ne:
                product._id,
            },
          })
            .select("_id")
            .lean();

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
      }
    }

    /* =====================================================
       SLUG
    ===================================================== */

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

    /* =====================================================
       NUMERIC VALUES
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "price"
      )
    ) {
      product.price =
        Number(
          product.price
        ) || 0;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "oldPrice"
      )
    ) {
      product.oldPrice =
        Number(
          product.oldPrice
        ) || 0;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "stock"
      )
    ) {
      product.stock =
        Math.max(
          0,
          Number(
            product.stock
          ) || 0
        );
    }

    /* =====================================================
       DISCOUNT
    ===================================================== */

    product.discount =
      calculateDiscount(
        product.price,
        product.oldPrice
      );

    /* =====================================================
       OPTIONAL SELLER ASSIGNMENT

       ADMIN ONLY
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "sellerId"
      )
    ) {
      if (
        body.sellerId ===
          null ||
        body.sellerId === ""
      ) {
        product.sellerId =
          null;

        product.sellerName =
          "";
      } else if (
        mongoose.Types.ObjectId.isValid(
          body.sellerId
        )
      ) {
        const seller =
          await User.findById(
            body.sellerId
          )
            .select(
              "firstName lastName role isActive"
            )
            .lean();

        if (
          !seller ||
          seller.role !==
            "seller"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Selected seller was not found.",
            },
            {
              status: 400,
            }
          );
        }

        if (
          seller.isActive ===
          false
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Selected seller is inactive.",
            },
            {
              status: 400,
            }
          );
        }

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

        product:
          formatProduct(
            product.toObject()
          ),
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

    if (
      error.code === 11000
    ) {
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

/* =========================================================
   DELETE /api/products

   ADMIN ONLY

   Safety:
   Product must first be deactivated.
========================================================= */

export async function DELETE(request) {
  try {
    await connectDB();

    const user =
      getCurrentUserToken();

    /* =====================================================
       LOGIN REQUIRED
    ===================================================== */

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

    /* =====================================================
       ADMIN ONLY
    ===================================================== */

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only administrators can delete products.",
        },
        {
          status: 403,
        }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const productId =
      searchParams.get(
        "productId"
      ) ||
      searchParams.get(
        "id"
      );

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

    /* =====================================================
       SAFETY CHECK

       Admin must deactivate product first.
    ===================================================== */

    if (
      product.isActive !== false
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only inactive products can be permanently deleted. Deactivate the product first.",
        },
        {
          status: 400,
        }
      );
    }

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
          "Failed to delete product.",

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