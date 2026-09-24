require("dotenv").config({
  path: ".env.local",
});

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "❌ MONGODB_URI is missing from .env.local"
  );

  process.exit(1);
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
      "Business, student, professional, creator and gaming laptops from established computer manufacturers.",
    featured: true,
    sortOrder: 1,
  },

  {
    name: "Desktops",
    slug: "desktops",
    description:
      "Desktop PCs for office work, home computing, professional workloads and gaming.",
    featured: true,
    sortOrder: 2,
  },

  {
    name: "Components",
    slug: "components",
    description:
      "Processors, SSDs, memory and other hardware for PC upgrades and new builds.",
    featured: true,
    sortOrder: 3,
  },

  {
    name: "Monitors",
    slug: "monitors",
    description:
      "Full HD, QHD, 4K, high-refresh and professional computer monitors.",
    featured: true,
    sortOrder: 4,
  },

  {
    name: "Gaming",
    slug: "gaming",
    description:
      "Gaming PCs, gaming laptops, gaming displays and gaming peripherals.",
    featured: true,
    sortOrder: 5,
  },

  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Keyboards, mice, headsets and useful accessories for computer users and gamers.",
    featured: true,
    sortOrder: 6,
  },
];

async function seedCategories() {
  try {
    console.log("");
    console.log("======================================");
    console.log("COMPUTERHUB CATEGORY SEEDER");
    console.log("======================================");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected");
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

    const allCategories =
      await Category.find({})
        .sort({
          sortOrder: 1,
        })
        .lean();

    console.log(
      `📊 Total categories: ${allCategories.length}`
    );

    console.log("");

    for (const category of allCategories) {
      console.log(
        `${category.sortOrder}. ${category.name} | ${category.slug}`
      );
    }

    console.log("");

    await mongoose.disconnect();

    console.log(
      "✅ Category seed completed successfully."
    );
  } catch (error) {
    console.error(
      "❌ Category seed failed:"
    );

    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

seedCategories();