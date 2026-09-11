import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import CategoryHeader from "@/components/category/CategoryHeader";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategorySubcategories from "@/components/category/CategorySubcategories";

const categories = {
  laptops: {
    slug: "laptops",
    name: "Laptops",
    description:
      "Explore laptops for business, education, gaming, creative work and everyday computing.",
    brands: ["Lenovo", "Dell", "HP", "ASUS", "Acer", "MSI"],
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
    name: "Desktop PCs",
    description:
      "Discover desktop computers for gaming, business, professional workloads and everyday use.",
    brands: ["Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI"],
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
    name: "PC Components",
    description:
      "Build or upgrade your computer with processors, graphics cards, memory, storage and other components.",
    brands: ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Gigabyte"],
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
    name: "Monitors",
    description:
      "Find gaming, professional, office, curved, ultrawide and high-resolution monitors.",
    brands: ["Samsung", "LG", "Dell", "ASUS", "Acer", "MSI"],
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

  accessories: {
    slug: "accessories",
    name: "Computer Accessories",
    description:
      "Complete your computer setup with keyboards, mice, headsets, webcams, chargers and useful accessories.",
    brands: ["Logitech", "Razer", "Corsair", "Anker", "HP", "Dell"],
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

  gaming: {
    slug: "gaming",
    name: "Gaming",
    description:
      "Build your ultimate gaming setup with gaming PCs, laptops, monitors, peripherals and accessories.",
    brands: ["ASUS", "MSI", "Razer", "Corsair", "Logitech", "Acer"],
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

  storage: {
    slug: "storage",
    name: "Storage",
    description:
      "Upgrade your storage with fast SSDs, reliable hard drives and portable storage solutions.",
    brands: ["Samsung", "Western Digital", "Kingston", "Crucial", "Seagate"],
    subcategories: [
      {
        name: "NVMe SSDs",
        slug: "nvme-ssds",
        icon: "hardDrive",
        parent: "storage",
      },
      {
        name: "SATA SSDs",
        slug: "sata-ssds",
        icon: "hardDrive",
        parent: "storage",
      },
      {
        name: "Internal HDDs",
        slug: "internal-hdds",
        icon: "hardDrive",
        parent: "storage",
      },
      {
        name: "External HDDs",
        slug: "external-hdds",
        icon: "hardDrive",
        parent: "storage",
      },
      {
        name: "External SSDs",
        slug: "external-ssds",
        icon: "hardDrive",
        parent: "storage",
      },
      {
        name: "USB Flash Drives",
        slug: "usb-flash-drives",
        icon: "hardDrive",
        parent: "storage",
      },
      {
        name: "Memory Cards",
        slug: "memory-cards",
        icon: "memory",
        parent: "storage",
      },
    ],
  },

  keyboards: {
    slug: "keyboards",
    name: "Keyboards",
    description:
      "Choose from mechanical, wireless, ergonomic and gaming keyboards for your setup.",
    brands: ["Logitech", "Razer", "Corsair", "Keychron", "Microsoft"],
    subcategories: [
      {
        name: "Mechanical Keyboards",
        slug: "mechanical-keyboards",
        icon: "keyboard",
        parent: "keyboards",
      },
      {
        name: "Gaming Keyboards",
        slug: "gaming-keyboards",
        icon: "gaming",
        parent: "keyboards",
      },
      {
        name: "Wireless Keyboards",
        slug: "wireless-keyboards",
        icon: "keyboard",
        parent: "keyboards",
      },
      {
        name: "Ergonomic Keyboards",
        slug: "ergonomic-keyboards",
        icon: "keyboard",
        parent: "keyboards",
      },
      {
        name: "Office Keyboards",
        slug: "office-keyboards",
        icon: "keyboard",
        parent: "keyboards",
      },
    ],
  },

  mice: {
    slug: "mice",
    name: "Computer Mice",
    description:
      "Find accurate and comfortable mice for office work, productivity and competitive gaming.",
    brands: ["Logitech", "Razer", "Corsair", "Microsoft", "HP"],
    subcategories: [
      {
        name: "Gaming Mice",
        slug: "gaming-mice",
        icon: "gaming",
        parent: "mice",
      },
      {
        name: "Wireless Mice",
        slug: "wireless-mice",
        icon: "mouse",
        parent: "mice",
      },
      {
        name: "Ergonomic Mice",
        slug: "ergonomic-mice",
        icon: "mouse",
        parent: "mice",
      },
      {
        name: "Office Mice",
        slug: "office-mice",
        icon: "mouse",
        parent: "mice",
      },
      {
        name: "Bluetooth Mice",
        slug: "bluetooth-mice",
        icon: "mouse",
        parent: "mice",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({ params }) {
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
              The category you are looking for does not exist or may have
              been moved.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Back to Home
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <CategoryHeader category={category} />

      <div className="container-main py-8">
        <CategorySubcategories items={category.subcategories} />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <CategorySidebar category={category} />

          <section className="min-w-0 flex-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {category.name} Products
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Products will appear here when the ComputerHub product
                    marketplace is connected to MongoDB.
                  </p>
                </div>

                <Link
                  href={`/products?category=${category.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Browse Products
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="mt-8 grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    <PackageSearch size={26} />
                  </div>

                  <h3 className="mt-4 font-black text-slate-900">
                    Products coming from the marketplace
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    In the next phase, we will build the real product listing
                    system with search, sorting, product cards and filters.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}