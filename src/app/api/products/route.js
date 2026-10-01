import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getCurrentUserToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeInactive =
      searchParams.get("includeInactive") === "true";

    const query = {};

    if (!includeInactive) {
      query.isActive = true;
    }

    const products = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const user = await getCurrentUserToken();

    if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized.",
    },
    { status: 401 }
  );
}

if (user.role !== "admin") {
  return NextResponse.json(
    {
      success: false,
      message: "Only administrators can add products.",
    },
    { status: 403 }
  );
}

    const body = await request.json();

if (!body.name || !String(body.name).trim()) {
  return NextResponse.json(
    {
      success: false,
      message: "Product name is required.",
    },
    { status: 400 }
  );
}

const category = await Category.findById(body.categoryId);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    const slug = String(body.name || "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-");

const product = await Product.create({
  ...body,
  slug,
  createdBy: user.id,
});

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(request) {
  try {
    await connectDB();

    const user = await getCurrentUserToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can update products.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const productId = body.productId || body.id;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    if (body.name !== undefined) {
      product.name = String(body.name).trim();

      product.slug = String(body.name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    if (body.shortDescription !== undefined)
  product.shortDescription = body.shortDescription;

if (body.description !== undefined)
  product.description = body.description;

if (body.price !== undefined)
  product.price = Number(body.price);

if (body.oldPrice !== undefined)
  product.oldPrice = Number(body.oldPrice);

if (body.originalPrice !== undefined)
  product.originalPrice = Number(body.originalPrice);

if (body.sku !== undefined)
  product.sku = body.sku;

if (body.brand !== undefined)
  product.brand = body.brand;

if (body.subcategory !== undefined)
  product.subcategory = body.subcategory;

if (body.processor !== undefined)
  product.processor = body.processor;

if (body.ram !== undefined)
  product.ram = body.ram;

if (body.storage !== undefined)
  product.storage = body.storage;

if (body.graphics !== undefined)
  product.graphics = body.graphics;

if (body.screenSize !== undefined)
  product.screenSize = body.screenSize;

if (body.stock !== undefined)
  product.stock = Number(body.stock);

if (body.images !== undefined)
  product.images = body.images;

if (body.image !== undefined)
  product.image = body.image;

if (body.featured !== undefined)
  product.featured = Boolean(body.featured);

if (body.freeDelivery !== undefined)
  product.freeDelivery = Boolean(body.freeDelivery);

if (body.isActive !== undefined)
  product.isActive = Boolean(body.isActive);

    if (body.categoryId !== undefined) {
      const category = await Category.findById(body.categoryId);

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Category not found.",
          },
          { status: 404 }
        );
      }

      product.categoryId = body.categoryId;
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(request) {
  try {
    await connectDB();

    const user = await getCurrentUserToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can delete products.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    if (product.isActive !== false) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Deactivate the product before permanently deleting it.",
        },
        { status: 400 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}