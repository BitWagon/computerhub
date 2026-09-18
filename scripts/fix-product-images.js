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
    images: [String],
    image: String,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

async function fixProductImages() {
  try {
    console.log("====================================");
    console.log("🖼️ COMPUTERHUB IMAGE FIX");
    console.log("====================================");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("");

    /*
     * The old MacBook image was returning 404:
     *
     * photo-1517336714739-489689fd1ca8
     *
     * Replace it with a working Unsplash image.
     */

    const oldImage =
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80";

    const newImage =
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80";

    const products = await Product.find({
      $or: [
        {
          images: oldImage,
        },
        {
          image: oldImage,
        },
      ],
    });

    if (products.length === 0) {
      console.log("ℹ️ No product found with the broken image.");
      console.log("");
    } else {
      for (const product of products) {
        console.log(`🔧 Fixing: ${product.name}`);

        if (Array.isArray(product.images)) {
          product.images = product.images.map((image) =>
            image === oldImage ? newImage : image
          );
        }

        if (product.image === oldImage) {
          product.image = newImage;
        }

        await product.save();

        console.log(`✅ Fixed: ${product.name}`);
        console.log("");
      }
    }

    console.log("====================================");
    console.log("📦 CURRENT PRODUCT IMAGES");
    console.log("====================================");

    const allProducts = await Product.find({}).select(
      "name images image"
    );

    for (const product of allProducts) {
      console.log("");
      console.log(`📌 ${product.name}`);

      if (product.images && product.images.length > 0) {
        console.log(`   Image: ${product.images[0]}`);
      } else if (product.image) {
        console.log(`   Image: ${product.image}`);
      } else {
        console.log("   ⚠️ No image");
      }
    }

    console.log("");
    console.log("====================================");
    console.log("🎉 IMAGE FIX COMPLETE");
    console.log("====================================");

    await mongoose.disconnect();

    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("");
    console.error("❌ IMAGE FIX FAILED");
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

fixProductImages();