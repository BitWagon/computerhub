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

async function fixAsusPrice() {
  try {
    console.log("====================================");
    console.log("🛠️ FIX ASUS PRODUCT PRICE");
    console.log("====================================");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("");

    const product = await Product.findOne({
      _id: "6aad97d50271c89d37379104",
    });

    if (!product) {
      console.log("❌ ASUS product was not found.");

      await mongoose.disconnect();
      return;
    }

    console.log(
      `📦 Product: ${product.name}`
    );

    console.log(
      `💰 Current Price: $${product.price}`
    );

    console.log(
      `🏷️ Current Original Price: $${product.oldPrice}`
    );

    console.log(
      `🔖 Current Discount: ${product.discount}%`
    );

    // Correct pricing
    const sellingPrice = 79;
    const originalPrice = 100;

    const discount = Math.round(
      ((originalPrice - sellingPrice) /
        originalPrice) *
        100
    );

    product.price = sellingPrice;
    product.oldPrice = originalPrice;
    product.discount = discount;

    await product.save();

    console.log("");
    console.log("====================================");
    console.log("✅ ASUS PRODUCT FIXED");
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
    console.log("🎉 PRICE UPDATE COMPLETE");
    console.log("====================================");

    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB connection closed"
    );
  } catch (error) {
    console.error("");
    console.error("❌ PRICE FIX FAILED");
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

fixAsusPrice();