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
    const query = { slug };

    if (
      excludeId &&
      mongoose.Types.ObjectId.isValid(excludeId)
    ) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existing = await Product.findOne(query)
      .select("_id")
      .lean();

    if (!existing) {
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
    ((previousPrice - currentPrice) / previousPrice) * 100
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

function formatProduct(product) {
  const images = normalizeImages(product.images);

  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || 0;

  let discount = Number(product.discount) || 0;

  if (
    discount === 0 &&
    oldPrice > price &&
    oldPrice > 0
  ) {
    discount = calculateDiscount(price, oldPrice);
  }

  return {
    ...product,

    _id: product._id
      ? product._id.toString()
      : null,

    id: product._id
      ? product._id.toString()
      : null,

    image: images[0] || "",
    images,

    price,
    oldPrice,
    discount,

    stock: Number(product.stock) || 0,

    featured: Boolean(product.featured),
    freeDelivery: Boolean(product.freeDelivery),

    isActive: product.isActive !== false,

    sellerId: product.sellerId
      ? product.sellerId.toString()
      : null,

    categoryId: product.categoryId
      ? {
          _id: product.categoryId._id
            ? product.categoryId._id.toString()
            : null,

          name: product.categoryId.name || "",
          slug: product.categoryId.slug || "",
          description:
            product.categoryId.description || "",
          image: product.categoryId.image || "",
          isActive:
            product.categoryId.isActive !== false,
        }
      : null,
  };
}

/*
|--------------------------------------------------------------------------
| GET /api/products
|--------------------------------------------------------------------------
|
| Public:
|   Active products
|
| Admin:
|   All products when includeInactive=true
|
| Seller:
|   Own products, including inactive, when
|   includeInactive=true
|
*/

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const includeInactive =
      searchParams.get("includeInactive") === "true";

    const categoryId =
      searchParams.get("categoryId");

    const category =
      searchParams.get("category");

    const featured =
      searchParams.get("featured");

    const user =
      getCurrentUserToken();

    /*
    |--------------------------------------------------------------------------
    | Determine access
    |--------------------------------------------------------------------------
    */

    if (includeInactive) {
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication required.",
          },
          { status: 401 }
        );
      }

      if (
        user.role !== "admin" &&
        user.role !== "seller"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Admin or seller access required.",
          },
          { status: 403 }
        );
      }
    }

    const query = {};

    /*
    |--------------------------------------------------------------------------
    | Active / inactive filtering
    |--------------------------------------------------------------------------
    */

    if (!includeInactive) {
      query.isActive = true;
    } else if (user?.role === "seller") {
      /*
       * Seller can see ONLY their own products.
       * This is the important ownership rule.
       */
      query.sellerId = user.userId;
    }

    /*
    |--------------------------------------------------------------------------
    | Category filtering
    |--------------------------------------------------------------------------
    */

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      query.categoryId = categoryId;
    } else if (category) {
      query.category = category;
    }

    /*
    |--------------------------------------------------------------------------
    | Featured filtering
    |--------------------------------------------------------------------------
    */

    if (featured === "true") {
      query.featured = true;
    }

    /*
    |--------------------------------------------------------------------------
    | Load products
    |--------------------------------------------------------------------------
    */

    const products = await Product.find(query)
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
      products.map(formatProduct);

    return NextResponse.json(
      {
        success: true,
        products: formattedProducts,
        count: formattedProducts.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/products
|--------------------------------------------------------------------------
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
          message: "You must be logged in.",
        },
        { status: 401 }
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
        { status: 403 }
      );
    }

    const body = await request.json();

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

    if (!String(name || "").trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
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
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    let finalCategoryId = null;
    let finalCategory = String(category || "").trim();

    if (
      categoryId &&
      mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      const foundCategory =
        await Category.findById(categoryId).lean();

      if (!foundCategory) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Selected category was not found.",
          },
          { status: 400 }
        );
      }

      finalCategoryId =
        foundCategory._id;

      finalCategory =
        foundCategory.name;
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
    | Seller ownership
    |--------------------------------------------------------------------------
    */

    let sellerId = null;
    let sellerName = "";

    if (user.role === "seller") {
      sellerId = user.userId;

      const seller =
        await User.findById(user.userId)
          .select("firstName lastName role isActive")
          .lean();

      if (!seller) {
        return NextResponse.json(
          {
            success: false,
            message: "Seller account not found.",
          },
          { status: 404 }
        );
      }

      if (
        seller.role !== "seller" ||
        seller.isActive === false
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Your seller account is not active.",
          },
          { status: 403 }
        );
      }

      sellerName =
        `${seller.firstName || ""} ${
          seller.lastName || ""
        }`.trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Admin can optionally assign product to seller
    |--------------------------------------------------------------------------
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
          { status: 400 }
        );
      }

      const seller =
        await User.findById(body.sellerId)
          .select("firstName lastName role isActive")
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
          { status: 400 }
        );
      }

      sellerId = seller._id;

      sellerName =
        `${seller.firstName || ""} ${
          seller.lastName || ""
        }`.trim();
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
        })
          .select("_id")
          .lean();

      if (existingSku) {
        return NextResponse.json(
          {
            success: false,
            message: "SKU already exists.",
          },
          { status: 400 }
        );
      }
    } else {
      let exists = true;

      while (exists) {
        finalSku =
          `CH-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000
          )}`;

        const found =
          await Product.findOne({
            sku: finalSku,
          })
            .select("_id")
            .lean();

        exists = Boolean(found);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Create slug
    |--------------------------------------------------------------------------
    */

    const slug =
      await createUniqueSlug(name);

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
    | Create
    |--------------------------------------------------------------------------
    */

    const product =
      await Product.create({
        name: String(name).trim(),

        slug,

        shortDescription:
          String(shortDescription || ""),

        description:
          String(description || ""),

        price: numericPrice,

        oldPrice: numericOldPrice,

        discount,

        stock: Math.max(
          0,
          Number(stock) || 0
        ),

        sku: finalSku,

        brand: String(brand || "").trim(),

        category: finalCategory,

        categoryId: finalCategoryId,

        subcategory:
          String(subcategory || "").trim(),

        processor:
          String(processor || "").trim(),

        ram:
          String(ram || "").trim(),

        storage:
          String(storage || "").trim(),

        graphics:
          String(graphics || "").trim(),

        screenSize:
          String(screenSize || "").trim(),

        images: finalImages,

        featured: Boolean(featured),

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
        product: formatProduct(
          product.toObject()
        ),
      },
      { status: 201 }
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
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create product.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH /api/products
|--------------------------------------------------------------------------
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
          message: "You must be logged in.",
        },
        { status: 401 }
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
            "You are not allowed to update products.",
        },
        { status: 403 }
      );
    }

    const body =
      await request.json();

    const productId =
      body.productId ||
      body.id ||
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
        { status: 400 }
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
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Seller can only update own products
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
          { status: 403 }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Allowed fields
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
    ];

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        product[field] = body[field];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Seller ownership cannot be changed by seller
    |--------------------------------------------------------------------------
    */

    if (user.role === "seller") {
      product.sellerId = user.userId;

      const seller =
        await User.findById(user.userId)
          .select("firstName lastName")
          .lean();

      if (seller) {
        product.sellerName =
          `${seller.firstName || ""} ${
            seller.lastName || ""
          }`.trim();
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Admin seller assignment
    |--------------------------------------------------------------------------
    */

    if (
      user.role === "admin" &&
      Object.prototype.hasOwnProperty.call(
        body,
        "sellerId"
      )
    ) {
      if (
        body.sellerId === null ||
        body.sellerId === ""
      ) {
        product.sellerId = null;
        product.sellerName = "";
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
              "firstName lastName role"
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
            { status: 400 }
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

    /*
    |--------------------------------------------------------------------------
    | Category
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
          { status: 400 }
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
      product.categoryId = null;
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
        normalizeImages(body.images);
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
        String(body.sku || "")
          .trim()
          .toUpperCase();

      if (newSku) {
        const duplicate =
          await Product.findOne({
            sku: newSku,
            _id: {
              $ne: product._id,
            },
          })
            .select("_id")
            .lean();

        if (duplicate) {
          return NextResponse.json(
            {
              success: false,
              message:
                "SKU already exists.",
            },
            { status: 400 }
          );
        }

        product.sku = newSku;
      } else {
        product.sku = undefined;
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
      String(body.name || "").trim()
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

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Product updated successfully.",
        product: formatProduct(
          product.toObject()
        ),
      },
      { status: 200 }
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
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update product.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE /api/products
|--------------------------------------------------------------------------
|
| Permanent deletion only.
| Product must already be inactive.
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
          message: "You must be logged in.",
        },
        { status: 401 }
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
        { status: 403 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const productId =
      searchParams.get("productId") ||
      searchParams.get("id");

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
        { status: 400 }
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
        { status: 404 }
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
          { status: 403 }
        );
      }
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
            "Only inactive products can be permanently deleted. Deactivate the product first.",
        },
        { status: 400 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      {
        success: true,
        message:
          "Product permanently deleted successfully.",
        productId,
      },
      { status: 200 }
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
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}