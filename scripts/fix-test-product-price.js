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
    price: Number,
    oldPrice: Number,
    discount: Number,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

async function fixTestProduct() {
  try {
    console.log("====================================");
    console.log("🛠️ FIX TEST PRODUCT PRICE");
    console.log("====================================");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("");

    const product = await Product.findOne({
      name: "Test Gaming Keyboard",
    });

    if (!product) {
      console.log(
        "❌ Test Gaming Keyboard was not found."
      );

      await mongoose.disconnect();
      return;
    }

    console.log(
      `📦 Product found: ${product.name}`
    );

    console.log(
      `💰 Old selling price: ${product.price}`
    );

    console.log(
      `🏷️ Old original price: ${
        product.oldPrice ?? "missing"
      }`
    );

    /*
     * Set:
     * Selling Price = 79
     * Original Price = 100
     *
     * Discount:
     * (100 - 79) / 100 × 100 = 21%
     */

    product.price = 79;
    product.oldPrice = 100;

    product.discount = Math.round(
      ((product.oldPrice - product.price) /
        product.oldPrice) *
        100
    );

    await product.save();

    console.log("");
    console.log("====================================");
    console.log("✅ PRODUCT UPDATED");
    console.log("====================================");

    console.log(
      `Product: ${product.name}`
    );

    console.log(
      `Selling Price: $${product.price}`
    );

    console.log(
      `Original Price: $${product.oldPrice}`
    );

    console.log(
      `Discount: ${product.discount}%`
    );

    console.log(
      `You Save: $${(
        product.oldPrice -
        product.price
      ).toFixed(2)}`
    );

    console.log("");
    console.log("====================================");
    console.log("🎉 PRICE FIX COMPLETE");
    console.log("====================================");

    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB connection closed"
    );
  } catch (error) {
    console.error("");
    console.error(
      "❌ PRICE FIX FAILED"
    );
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

fixTestProduct();