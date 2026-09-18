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

const ProductSchema = new mongoose.Schema(
  {
    name: String,

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    shortDescription: String,
    description: String,

    price: Number,
    oldPrice: Number,
    discount: Number,
    stock: Number,

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    brand: String,
    category: String,

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subcategory: String,

    processor: String,
    ram: String,
    storage: String,
    graphics: String,
    screenSize: String,

    images: [String],

    featured: {
      type: Boolean,
      default: false,
    },

    freeDelivery: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    sellerName: String,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

const products = [
  {
    name: "Dell Inspiron 15 Laptop",
    slug: "dell-inspiron-15-laptop",
    shortDescription:
      "Reliable 15.6-inch laptop for work, study and everyday computing.",
    description:
      "The Dell Inspiron 15 is designed for everyday productivity, study, office work and entertainment. It combines a comfortable display with dependable performance and practical connectivity.",
    price: 549,
    oldPrice: 649,
    discount: 15,
    stock: 18,
    sku: "CH-DELL-INS15-001",
    brand: "Dell",
    category: "Laptops",
    subcategory: "Business Laptops",
    processor: "Intel Core i5",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "Intel Integrated Graphics",
    screenSize: '15.6"',
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "HP Pavilion 15 Laptop",
    slug: "hp-pavilion-15-laptop",
    shortDescription:
      "Powerful everyday laptop with modern performance and a sleek design.",
    description:
      "The HP Pavilion 15 provides a balanced combination of performance, portability and storage. It is suitable for office applications, education, browsing and multimedia.",
    price: 679,
    oldPrice: 749,
    discount: 9,
    stock: 15,
    sku: "CH-HP-PAV15-002",
    brand: "HP",
    category: "Laptops",
    subcategory: "Everyday Laptops",
    processor: "Intel Core i7",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "Intel Iris Xe Graphics",
    screenSize: '15.6"',
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "Lenovo ThinkPad E14",
    slug: "lenovo-thinkpad-e14",
    shortDescription:
      "Business-focused laptop built for productivity and professional work.",
    description:
      "The Lenovo ThinkPad E14 offers dependable business performance, a practical design and excellent productivity features for professionals, students and small businesses.",
    price: 729,
    oldPrice: 829,
    discount: 12,
    stock: 12,
    sku: "CH-LEN-E14-003",
    brand: "Lenovo",
    category: "Laptops",
    subcategory: "Business Laptops",
    processor: "Intel Core i5",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "Intel Integrated Graphics",
    screenSize: '14"',
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "Apple MacBook Air M3",
    slug: "apple-macbook-air-m3",
    shortDescription:
      "Slim and powerful Apple laptop powered by the M3 chip.",
    description:
      "The MacBook Air M3 combines a lightweight design with strong performance and excellent battery efficiency. It is ideal for professionals, students and creative workflows.",
    price: 999,
    oldPrice: 1099,
    discount: 9,
    stock: 8,
    sku: "CH-APPLE-MBA3-004",
    brand: "Apple",
    category: "Laptops",
    subcategory: "Premium Laptops",
    processor: "Apple M3",
    ram: "16GB",
    storage: "512GB SSD",
    graphics: "Apple Integrated GPU",
    screenSize: '13.6"',
    images: [
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "ASUS ROG Gaming Desktop",
    slug: "asus-rog-gaming-desktop",
    shortDescription:
      "High-performance gaming desktop built for demanding games and applications.",
    description:
      "The ASUS ROG Gaming Desktop delivers powerful desktop performance for modern gaming, streaming, content creation and demanding applications.",
    price: 1499,
    oldPrice: 1699,
    discount: 12,
    stock: 6,
    sku: "CH-ASUS-ROGPC-005",
    brand: "ASUS",
    category: "Desktops",
    subcategory: "Gaming PCs",
    processor: "AMD Ryzen 7",
    ram: "32GB",
    storage: "1TB SSD",
    graphics: "NVIDIA GeForce RTX",
    screenSize: "",
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "MSI Gaming Desktop",
    slug: "msi-gaming-desktop",
    shortDescription:
      "Powerful gaming desktop designed for high-performance gaming.",
    description:
      "The MSI Gaming Desktop provides strong performance for gaming, streaming and demanding applications with fast SSD storage and powerful graphics.",
    price: 1299,
    oldPrice: 1449,
    discount: 10,
    stock: 7,
    sku: "CH-MSI-GPC-006",
    brand: "MSI",
    category: "Desktops",
    subcategory: "Gaming PCs",
    processor: "Intel Core i7",
    ram: "32GB",
    storage: "1TB SSD",
    graphics: "NVIDIA GeForce RTX",
    screenSize: "",
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "Samsung 27-inch 4K Monitor",
    slug: "samsung-27-inch-4k-monitor",
    shortDescription:
      "Sharp 27-inch 4K monitor for work, entertainment and creative tasks.",
    description:
      "The Samsung 27-inch 4K Monitor provides a detailed high-resolution display suitable for productivity, entertainment, design and everyday computing.",
    price: 349,
    oldPrice: 399,
    discount: 13,
    stock: 20,
    sku: "CH-SAM-27-4K-007",
    brand: "Samsung",
    category: "Monitors",
    subcategory: "4K Monitors",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    screenSize: '27"',
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },

  {
    name: "Logitech Wireless Gaming Mouse",
    slug: "logitech-wireless-gaming-mouse",
    shortDescription:
      "Responsive wireless gaming mouse with accurate tracking.",
    description:
      "The Logitech Wireless Gaming Mouse provides responsive tracking, comfortable handling and wireless freedom for gaming and everyday computer use.",
    price: 59,
    oldPrice: 79,
    discount: 25,
    stock: 35,
    sku: "CH-LOG-MOUSE-008",
    brand: "Logitech",
    category: "Accessories",
    subcategory: "Gaming Mice",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    screenSize: "",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    freeDelivery: true,
    isActive: true,
    sellerName: "ComputerHub Official",
  },
];

async function seedProducts() {
  try {
    console.log("");
    console.log("========================================");
    console.log("🚀 ComputerHub Product Seeder");
    console.log("========================================");
    console.log("");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("");

    let added = 0;
    let skipped = 0;

    for (const productData of products) {
      const existingProduct = await Product.findOne({
        $or: [
          {
            sku: productData.sku,
          },
          {
            slug: productData.slug,
          },
        ],
      });

      if (existingProduct) {
        console.log(
          `⚠️ Already exists: ${productData.name}`
        );

        skipped++;

        continue;
      }

      try {
        await Product.create(productData);

        console.log(
          `✅ Added: ${productData.name}`
        );

        added++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(
            `⚠️ Duplicate skipped: ${productData.name}`
          );

          skipped++;

          continue;
        }

        throw error;
      }
    }

    const totalProducts =
      await Product.countDocuments();

    const activeProducts =
      await Product.countDocuments({
        isActive: true,
      });

    console.log("");
    console.log("========================================");
    console.log("📦 ComputerHub Product Summary");
    console.log("========================================");
    console.log(
      `✅ New products added: ${added}`
    );
    console.log(
      `⚠️ Existing products skipped: ${skipped}`
    );
    console.log(
      `📦 Total products: ${totalProducts}`
    );
    console.log(
      `🟢 Active products: ${activeProducts}`
    );
    console.log("========================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error(
      "❌ Product seeding failed:"
    );
    console.error(error);
    console.error("");

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB connection closed"
    );
  }
}

seedProducts();