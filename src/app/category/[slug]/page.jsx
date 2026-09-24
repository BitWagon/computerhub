import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

import CategoryHeader from "@/components/category/CategoryHeader";
import CategorySubcategories from "@/components/category/CategorySubcategories";
import CategoryProductsBrowser from "@/components/category/CategoryProductsBrowser";

const categories = {
  laptops: {
    slug: "laptops",
    dbNames: ["Laptops", "Laptop"],
    name: "Laptops",
    description:
      "Shop laptops for business, education, professional work, creative tasks, everyday computing and gaming.",
    brands: [
      "Lenovo",
      "Dell",
      "HP",
      "ASUS",
      "Acer",
      "MSI",
      "Apple",
    ],
    subcategories: [
      {
        name: "Gaming Laptops",
        slug: "gaming-laptops",
        icon: "gaming",
        parent: "laptops",
      },
      {
        name: "Business Laptops",
        slug: "business-laptops",
        icon: "laptop",
        parent: "laptops",
      },
      {
        name: "Student Laptops",
        slug: "student-laptops",
        icon: "laptop",
        parent: "laptops",
      },
      {
        name: "Ultrabooks",
        slug: "ultrabooks",
        icon: "laptop",
        parent: "laptops",
      },
      {
        name: "2-in-1 Laptops",
        slug: "2-in-1-laptops",
        icon: "laptop",
        parent: "laptops",
      },
      {
        name: "Creator Laptops",
        slug: "creator-laptops",
        icon: "laptop",
        parent: "laptops",
      },
      {
        name: "MacBooks",
        slug: "macbooks",
        icon: "laptop",
        parent: "laptops",
      },
      {
        name: "Budget Laptops",
        slug: "budget-laptops",
        icon: "laptop",
        parent: "laptops",
      },
    ],
  },

  desktops: {
    slug: "desktops",
    dbNames: [
      "Desktops",
      "Desktop",
      "Desktop PCs",
      "Desktop PC",
    ],
    name: "Desktop PCs",
    description:
      "Shop desktop computers for office work, home computing, professional workloads, custom builds and gaming.",
    brands: [
      "Dell",
      "HP",
      "Lenovo",
      "ASUS",
      "Acer",
      "MSI",
    ],
    subcategories: [
      {
        name: "Gaming PCs",
        slug: "gaming-pcs",
        icon: "gaming",
        parent: "desktops",
      },
      {
        name: "Office PCs",
        slug: "office-pcs",
        icon: "monitor",
        parent: "desktops",
      },
      {
        name: "Workstations",
        slug: "workstations",
        icon: "server",
        parent: "desktops",
      },
      {
        name: "All-in-One PCs",
        slug: "all-in-one",
        icon: "monitor",
        parent: "desktops",
      },
      {
        name: "Mini PCs",
        slug: "mini-pcs",
        icon: "monitor",
        parent: "desktops",
      },
      {
        name: "Custom PCs",
        slug: "custom-pcs",
        icon: "cpu",
        parent: "desktops",
      },
    ],
  },

  components: {
    slug: "components",
    dbNames: [
      "Components",
      "PC Components",
      "Computer Components",
      "PC Component",
    ],
    name: "PC Components",
    description:
      "Find processors, graphics cards, motherboards, memory, SSDs, hard drives, power supplies, cases and cooling hardware.",
    brands: [
      "Intel",
      "AMD",
      "NVIDIA",
      "ASUS",
      "MSI",
      "Gigabyte",
      "Samsung",
      "Corsair",
      "Kingston",
      "Crucial",
    ],
    subcategories: [
      {
        name: "Processors",
        slug: "processors",
        icon: "cpu",
        parent: "components",
      },
      {
        name: "Graphics Cards",
        slug: "graphics-cards",
        icon: "gaming",
        parent: "components",
      },
      {
        name: "Motherboards",
        slug: "motherboards",
        icon: "motherboard",
        parent: "components",
      },
      {
        name: "RAM",
        slug: "ram",
        icon: "memory",
        parent: "components",
      },
      {
        name: "SSD",
        slug: "ssd",
        icon: "hardDrive",
        parent: "components",
      },
      {
        name: "Hard Drives",
        slug: "hard-drives",
        icon: "hardDrive",
        parent: "components",
      },
      {
        name: "Power Supplies",
        slug: "power-supplies",
        icon: "cpu",
        parent: "components",
      },
      {
        name: "PC Cases",
        slug: "pc-cases",
        icon: "cpu",
        parent: "components",
      },
      {
        name: "CPU Coolers",
        slug: "cpu-coolers",
        icon: "fan",
        parent: "components",
      },
      {
        name: "PC Fans",
        slug: "pc-fans",
        icon: "fan",
        parent: "components",
      },
    ],
  },

  monitors: {
    slug: "monitors",
    dbNames: ["Monitors", "Monitor"],
    name: "Monitors",
    description:
      "Shop gaming, office, professional, curved, ultrawide, QHD and 4K computer monitors.",
    brands: [
      "Samsung",
      "LG",
      "Dell",
      "ASUS",
      "Acer",
      "MSI",
      "BenQ",
    ],
    subcategories: [
      {
        name: "Gaming Monitors",
        slug: "gaming-monitors",
        icon: "gaming",
        parent: "monitors",
      },
      {
        name: "4K Monitors",
        slug: "4k-monitors",
        icon: "monitor",
        parent: "monitors",
      },
      {
        name: "Office Monitors",
        slug: "office-monitors",
        icon: "monitor",
        parent: "monitors",
      },
      {
        name: "Curved Monitors",
        slug: "curved-monitors",
        icon: "monitor",
        parent: "monitors",
      },
      {
        name: "Ultrawide Monitors",
        slug: "ultrawide-monitors",
        icon: "monitor",
        parent: "monitors",
      },
      {
        name: "Professional Monitors",
        slug: "professional-monitors",
        icon: "monitor",
        parent: "monitors",
      },
    ],
  },

  gaming: {
    slug: "gaming",
    dbNames: ["Gaming", "Gaming Products"],
    name: "Gaming",
    description:
      "Build a complete gaming setup with gaming PCs, gaming laptops, monitors, keyboards, mice, headsets and gaming accessories.",
    brands: [
      "ASUS",
      "MSI",
      "Razer",
      "Corsair",
      "Logitech",
      "Acer",
      "HP",
      "Lenovo",
    ],
    subcategoryNames: [
      "Gaming PCs",
      "Gaming Laptops",
      "Gaming Monitors",
      "Gaming Keyboards",
      "Gaming Mice",
      "Gaming Headsets",
      "Gaming Chairs",
      "Gaming Accessories",
    ],
    subcategories: [
      {
        name: "Gaming PCs",
        slug: "gaming-pcs",
        icon: "gaming",
        parent: "gaming",
      },
      {
        name: "Gaming Laptops",
        slug: "gaming-laptops",
        icon: "laptop",
        parent: "gaming",
      },
      {
        name: "Gaming Monitors",
        slug: "gaming-monitors",
        icon: "monitor",
        parent: "gaming",
      },
      {
        name: "Gaming Keyboards",
        slug: "gaming-keyboards",
        icon: "keyboard",
        parent: "gaming",
      },
      {
        name: "Gaming Mice",
        slug: "gaming-mice",
        icon: "mouse",
        parent: "gaming",
      },
      {
        name: "Gaming Headsets",
        slug: "gaming-headsets",
        icon: "headphones",
        parent: "gaming",
      },
      {
        name: "Gaming Chairs",
        slug: "gaming-chairs",
        icon: "gaming",
        parent: "gaming",
      },
      {
        name: "Gaming Accessories",
        slug: "gaming-accessories",
        icon: "gamepad",
        parent: "gaming",
      },
    ],
  },

  accessories: {
    slug: "accessories",
    dbNames: [
      "Accessories",
      "Computer Accessories",
      "PC Accessories",
      "Accessory",
    ],
    name: "Accessories",
    description:
      "Complete your computer setup with keyboards, mice, headsets, webcams, microphones, chargers, hubs and other accessories.",
    brands: [
      "Logitech",
      "Razer",
      "Corsair",
      "Anker",
      "HP",
      "Dell",
      "Microsoft",
      "Keychron",
    ],
    subcategories: [
      {
        name: "Keyboards",
        slug: "keyboards",
        icon: "keyboard",
        parent: "accessories",
      },
      {
        name: "Mice",
        slug: "mice",
        icon: "mouse",
        parent: "accessories",
      },
      {
        name: "Headsets",
        slug: "headsets",
        icon: "headphones",
        parent: "accessories",
      },
      {
        name: "Webcams",
        slug: "webcams",
        icon: "webcam",
        parent: "accessories",
      },
      {
        name: "Microphones",
        slug: "microphones",
        icon: "microphone",
        parent: "accessories",
      },
      {
        name: "Laptop Stands",
        slug: "laptop-stands",
        icon: "laptop",
        parent: "accessories",
      },
      {
        name: "Cooling Pads",
        slug: "cooling-pads",
        icon: "fan",
        parent: "accessories",
      },
      {
        name: "Chargers",
        slug: "chargers",
        icon: "cable",
        parent: "accessories",
      },
      {
        name: "USB Hubs",
        slug: "usb-hubs",
        icon: "cable",
        parent: "accessories",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }));
}

function serializeProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images
        .map((image) => String(image || "").trim())
        .filter(Boolean)
    : [];

  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || 0;

  let discount = Number(product.discount) || 0;

  if (
    discount <= 0 &&
    oldPrice > price &&
    oldPrice > 0
  ) {
    discount = Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }

  return {
    ...product,

    _id: product._id?.toString() || null,

    id: product._id?.toString() || null,

    categoryId:
      product.categoryId?.toString() || null,

    image: images[0] || "",

    images,

    price,

    oldPrice,

    discount,

    stock: Number(product.stock) || 0,

    rating: Number(product.rating) || 0,

    reviews: Number(product.reviews) || 0,

    isActive:
      product.isActive !== false,

    featured: Boolean(product.featured),

    freeDelivery:
      Boolean(product.freeDelivery),

    createdAt: product.createdAt
      ? new Date(
          product.createdAt
        ).toISOString()
      : null,

    updatedAt: product.updatedAt
      ? new Date(
          product.updatedAt
        ).toISOString()
      : null,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}) {
  const { slug } = await params;

  const category = categories[slug];

  if (!category) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center py-20">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <PackageSearch size={30} />
            </div>

            <h1 className="mt-5 text-3xl font-black text-slate-900">
              Category Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              The category you are looking for does
              not exist or may have been moved.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse Products
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let products = [];
  let databaseError = "";

  try {
    await connectDB();

    const categoryDocument =
      await Category.findOne({
        slug: category.slug,
        isActive: true,
      }).lean();

    const orConditions = [
      {
        category: {
          $in: category.dbNames,
        },
      },
    ];

    if (categoryDocument?._id) {
      orConditions.push({
        categoryId:
          categoryDocument._id,
      });
    }

    /*
     * Gaming is a special marketplace
     * collection. A gaming desktop may have
     * category = "Desktops" but
     * subcategory = "Gaming PCs".
     */
    if (
      category.subcategoryNames?.length
    ) {
      orConditions.push({
        subcategory: {
          $in: category.subcategoryNames,
        },
      });
    }

    products = await Product.find({
      isActive: true,
      $or: orConditions,
    })
      .sort({
        featured: -1,
        createdAt: -1,
      })
      .lean();

    products = products.map(
      serializeProduct
    );
  } catch (error) {
    console.error(
      `Category ${slug} error:`,
      error
    );

    databaseError =
      "We could not load this category from the marketplace database.";
  }

  const selectedSubcategory =
    typeof searchParams?.subcategory ===
    "string"
      ? searchParams.subcategory
      : "";

  return (
    <main className="min-h-screen bg-slate-50">
      <CategoryHeader
        category={category}
      />

      <div className="container-main py-8">
        <CategorySubcategories
          items={category.subcategories}
        />

        <CategoryProductsBrowser
          category={category}
          products={products}
          databaseError={databaseError}
          initialSubcategory={
            selectedSubcategory
          }
        />
      </div>
    </main>
  );
}