const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env.local",
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ MONGODB_URI is missing from .env.local"
  );
}

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    price: Number,
    oldPrice: Number,
    discount: Number,
    stock: Number,
    brand: String,
    category: String,
    sellerId: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

async function findLatestProducts() {
  try {
    console.log("====================================");
    console.log("🔎 COMPUTERHUB LATEST PRODUCTS");
    console.log("====================================");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("");

    const products = await Product.find({})
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    if (products.length === 0) {
      console.log("❌ No products found.");
      await mongoose.disconnect();
      return;
    }

    console.log(
      `📦 Found ${products.length} latest products`
    );

    console.log("");

    products.forEach((product, index) => {
      console.log(
        "------------------------------------"
      );

      console.log(
        `${index + 1}. ${product.name || "Unnamed Product"}`
      );

      console.log(
        `   ID: ${product._id}`
      );

      console.log(
        `   Slug: ${product.slug || "N/A"}`
      );

      console.log(
        `   Price: ${
          product.price !== undefined
            ? "$" + product.price
            : "N/A"
        }`
      );

      console.log(
        `   Original Price: ${
          product.oldPrice !== undefined &&
          product.oldPrice !== null
            ? "$" + product.oldPrice
            : "MISSING"
        }`
      );

      console.log(
        `   Discount: ${
          product.discount !== undefined
            ? product.discount + "%"
            : "MISSING"
        }`
      );

      console.log(
        `   Stock: ${
          product.stock !== undefined
            ? product.stock
            : "N/A"
        }`
      );

      console.log(
        `   Brand: ${
          product.brand || "N/A"
        }`
      );

      console.log(
        `   Category: ${
          product.category || "N/A"
        }`
      );

      console.log(
        `   Seller ID: ${
          product.sellerId || "N/A"
        }`
      );

      console.log(
        `   Created: ${
          product.createdAt
            ? product.createdAt
            : "N/A"
        }`
      );
    });

    console.log("");
    console.log("====================================");
    console.log("🔎 SEARCH COMPLETE");
    console.log("====================================");

    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB connection closed"
    );
  } catch (error) {
    console.error("");
    console.error(
      "❌ SEARCH FAILED"
    );
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

findLatestProducts();