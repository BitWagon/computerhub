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

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

const categories = [
  {
    name: "Laptops",
    slug: "laptops",
    description:
      "Laptops for work, study, business and everyday use.",
    featured: true,
    sortOrder: 1,
  },

  {
    name: "Desktops",
    slug: "desktops",
    description:
      "Desktop computers and complete PC systems.",
    featured: true,
    sortOrder: 2,
  },

  {
    name: "Components",
    slug: "components",
    description:
      "Computer components including RAM, SSDs and graphics cards.",
    featured: true,
    sortOrder: 3,
  },

  {
    name: "Gaming",
    slug: "gaming",
    description:
      "Gaming PCs, gaming hardware and gaming accessories.",
    featured: true,
    sortOrder: 4,
  },

  {
    name: "Monitors",
    slug: "monitors",
    description:
      "Computer monitors for work, entertainment and gaming.",
    featured: true,
    sortOrder: 5,
  },

  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Keyboards, mice and other computer accessories.",
    featured: true,
    sortOrder: 6,
  },
];

async function seedCategories() {
  try {
    console.log("====================================");
    console.log("🏷️ COMPUTERHUB CATEGORY SEEDER");
    console.log("====================================");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("");

    for (const categoryData of categories) {
      const existingCategory =
        await Category.findOne({
          $or: [
            {
              slug: categoryData.slug,
            },
            {
              name: categoryData.name,
            },
          ],
        });

      if (existingCategory) {
        existingCategory.name =
          categoryData.name;

        existingCategory.slug =
          categoryData.slug;

        existingCategory.description =
          categoryData.description;

        existingCategory.featured =
          categoryData.featured;

        existingCategory.sortOrder =
          categoryData.sortOrder;

        existingCategory.isActive = true;

        await existingCategory.save();

        console.log(
          `🔄 Updated: ${categoryData.name}`
        );
      } else {
        await Category.create(
          categoryData
        );

        console.log(
          `✅ Added: ${categoryData.name}`
        );
      }
    }

    console.log("");
    console.log("====================================");
    console.log("📦 COMPUTERHUB CATEGORIES");
    console.log("====================================");

    const allCategories =
      await Category.find({})
        .sort({
          sortOrder: 1,
        })
        .lean();

    for (const category of allCategories) {
      console.log(
        `${category.sortOrder}. ${category.name} | ${category.slug} | ${
          category.isActive
            ? "Active"
            : "Inactive"
        }`
      );
    }

    console.log("");
    console.log(
      `📊 Total categories: ${allCategories.length}`
    );

    console.log(
      `🟢 Active categories: ${
        allCategories.filter(
          (category) =>
            category.isActive
        ).length
      }`
    );

    console.log("");
    console.log("====================================");
    console.log("🎉 CATEGORY SEED COMPLETE");
    console.log("====================================");

    await mongoose.disconnect();

    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("");
    console.error(
      "❌ CATEGORY SEED FAILED"
    );
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

seedCategories();