"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck, RotateCcw, Truck } from "lucide-react";
import { useParams } from "next/navigation";

import ProductImages from "@/components/products/ProductImages";
import ProductInfo from "@/components/products/ProductInfo";
import ProductReviews from "@/components/products/ProductsReviews"; 

const products = [
  {
    id: "1",
    name: "Dell Inspiron 15 Laptop - Intel Core i5, 8GB RAM, 512GB SSD",
    images: [
      "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 699,
    oldPrice: 799,
    discount: 13,
    rating: 4.6,
    reviews: 124,
    seller: "ComputerHub Store",
    category: "Laptops",
    subcategory: "Business",
    brand: "Dell",
    ram: "8 GB",
    storage: "512 GB",
    processor: "Intel Core i5",
    graphics: "Intel Iris Xe",
    screenSize: "15.6 inch",
    stock: 15,
    freeDelivery: true,
    description:
      "The Dell Inspiron 15 is designed for everyday productivity, business tasks, study, entertainment and multitasking. It combines a powerful Intel Core i5 processor with 8GB RAM and a fast 512GB SSD.",
    featured: true,
  },
  {
    id: "2",
    name: "HP Pavilion Gaming Laptop - Core i7, 16GB RAM, 1TB SSD",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 1099,
    oldPrice: 1249,
    discount: 12,
    rating: 4.8,
    reviews: 89,
    seller: "Tech World",
    category: "Laptops",
    subcategory: "Gaming",
    brand: "HP",
    ram: "16 GB",
    storage: "1 TB",
    processor: "Intel Core i7",
    graphics: "NVIDIA GeForce RTX",
    screenSize: "15.6 inch",
    stock: 8,
    freeDelivery: true,
    description:
      "A powerful gaming laptop built for demanding games, creative workloads and everyday productivity. The HP Pavilion Gaming Laptop delivers strong performance with an Intel Core i7 processor, 16GB RAM and 1TB SSD.",
    featured: true,
  },
  {
    id: "3",
    name: "Lenovo ThinkPad Business Laptop - Core i5, 16GB RAM",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 849,
    oldPrice: 949,
    discount: 11,
    rating: 4.7,
    reviews: 76,
    seller: "Laptop Center",
    category: "Laptops",
    subcategory: "Business",
    brand: "Lenovo",
    ram: "16 GB",
    storage: "512 GB",
    processor: "Intel Core i5",
    graphics: "Intel Integrated Graphics",
    screenSize: "14 inch",
    stock: 11,
    freeDelivery: true,
    description:
      "A business-focused Lenovo ThinkPad designed for professional work, office applications, study and multitasking. It provides dependable performance and a comfortable productivity experience.",
    featured: false,
  },
  {
    id: "4",
    name: "Apple MacBook Air M3 - 13-inch, 16GB RAM, 512GB SSD",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 1299,
    oldPrice: 1399,
    discount: 7,
    rating: 4.9,
    reviews: 215,
    seller: "Apple Technology Store",
    category: "Laptops",
    subcategory: "MacBooks",
    brand: "Apple",
    ram: "16 GB",
    storage: "512 GB",
    processor: "Apple M3",
    graphics: "Integrated Apple Graphics",
    screenSize: "13.6 inch",
    stock: 6,
    freeDelivery: true,
    description:
      "A lightweight and powerful MacBook Air featuring Apple's M3 chip, 16GB memory and 512GB SSD storage. Ideal for productivity, creative work, study and everyday computing.",
    featured: true,
  },
  {
    id: "5",
    name: "ASUS ROG Gaming Desktop PC - Ryzen 7, 32GB RAM, RTX Graphics",
    images: [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 1599,
    oldPrice: 1799,
    discount: 11,
    rating: 4.8,
    reviews: 94,
    seller: "Gaming Zone",
    category: "Desktops",
    subcategory: "Gaming PCs",
    brand: "ASUS",
    ram: "32 GB",
    storage: "1 TB",
    processor: "AMD Ryzen 7",
    graphics: "NVIDIA GeForce RTX",
    screenSize: "",
    stock: 5,
    freeDelivery: true,
    description:
      "A high-performance gaming desktop designed for demanding games, streaming, content creation and intensive applications. Built with a Ryzen 7 processor, 32GB RAM and dedicated RTX graphics.",
    featured: true,
  },
  {
    id: "6",
    name: "MSI Gaming Desktop - Intel Core i7, 32GB RAM, RTX 4070",
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 1899,
    oldPrice: 2099,
    discount: 10,
    rating: 4.7,
    reviews: 67,
    seller: "PC Masters",
    category: "Desktops",
    subcategory: "Gaming PCs",
    brand: "MSI",
    ram: "32 GB",
    storage: "2 TB",
    processor: "Intel Core i7",
    graphics: "NVIDIA GeForce RTX 4070",
    screenSize: "",
    stock: 4,
    freeDelivery: true,
    description:
      "A powerful MSI gaming desktop equipped with an Intel Core i7 processor, 32GB RAM, 2TB storage and RTX 4070 graphics. Built for high-performance gaming and demanding workloads.",
    featured: true,
  },
  {
    id: "7",
    name: "Samsung 27-inch 4K UHD Monitor",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 399,
    oldPrice: 469,
    discount: 15,
    rating: 4.5,
    reviews: 143,
    seller: "Display Store",
    category: "Monitors",
    subcategory: "4K",
    brand: "Samsung",
    ram: "",
    storage: "",
    processor: "",
    graphics: "",
    screenSize: "27 inch",
    stock: 20,
    freeDelivery: true,
    description:
      "A 27-inch Samsung 4K UHD monitor designed for sharp visuals, productivity, entertainment and creative work. Enjoy detailed images and a spacious display for everyday computing.",
    featured: false,
  },
  {
    id: "8",
    name: "Acer 24-inch Gaming Monitor 165Hz",
    images: [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 279,
    oldPrice: 329,
    discount: 15,
    rating: 4.4,
    reviews: 98,
    seller: "Gaming Zone",
    category: "Monitors",
    subcategory: "Gaming",
    brand: "Acer",
    ram: "",
    storage: "",
    processor: "",
    graphics: "",
    screenSize: "24 inch",
    stock: 17,
    freeDelivery: true,
    description:
      "A responsive Acer gaming monitor with a fast 165Hz refresh rate. Designed for smooth gaming, everyday entertainment and a responsive desktop experience.",
    featured: false,
  },
  {
    id: "9",
    name: "Corsair 32GB DDR5 RAM Kit",
    images: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 119,
    oldPrice: 149,
    discount: 20,
    rating: 4.8,
    reviews: 187,
    seller: "PC Components Hub",
    category: "PC Components",
    subcategory: "RAM",
    brand: "Corsair",
    ram: "32 GB",
    storage: "",
    processor: "",
    graphics: "",
    screenSize: "",
    stock: 30,
    freeDelivery: true,
    description:
      "High-performance Corsair DDR5 memory designed to improve system responsiveness, multitasking performance and gaming workloads.",
    featured: true,
  },
  {
    id: "10",
    name: "Samsung 1TB NVMe SSD",
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1628557112205-56b0e2b2e1d0?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 89,
    oldPrice: 109,
    discount: 18,
    rating: 4.9,
    reviews: 241,
    seller: "Storage World",
    category: "PC Components",
    subcategory: "SSD",
    brand: "Samsung",
    ram: "",
    storage: "1 TB",
    processor: "",
    graphics: "",
    screenSize: "",
    stock: 42,
    freeDelivery: true,
    description:
      "A fast Samsung 1TB NVMe SSD providing high-speed storage for operating systems, applications, games and personal files.",
    featured: true,
  },
  {
    id: "11",
    name: "ASUS Mechanical Gaming Keyboard RGB",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 79,
    oldPrice: 99,
    discount: 20,
    rating: 4.6,
    reviews: 154,
    seller: "Gaming Accessories",
    category: "Accessories",
    subcategory: "Keyboards",
    brand: "ASUS",
    ram: "",
    storage: "",
    processor: "",
    graphics: "",
    screenSize: "",
    stock: 35,
    freeDelivery: true,
    description:
      "A mechanical ASUS gaming keyboard with RGB lighting, designed for responsive gaming and comfortable everyday typing.",
    featured: false,
  },
  {
    id: "12",
    name: "Logitech Wireless Gaming Mouse",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=1000&q=80",
    ],
    price: 59,
    oldPrice: 79,
    discount: 25,
    rating: 4.7,
    reviews: 203,
    seller: "Gaming Accessories",
    category: "Accessories",
    subcategory: "Mice",
    brand: "Logitech",
    ram: "",
    storage: "",
    processor: "",
    graphics: "",
    screenSize: "",
    stock: 50,
    freeDelivery: true,
    description:
      "A wireless Logitech gaming mouse designed for comfortable control, accurate tracking and reliable everyday gaming performance.",
    featured: false,
  },
];

const reviewData = {
  "1": [
    {
      id: 1,
      name: "James",
      rating: 5,
      date: "Recently",
      comment:
        "Excellent laptop for work and everyday use. The SSD makes everything feel very responsive.",
    },
    {
      id: 2,
      name: "Michael",
      rating: 4,
      date: "Recently",
      comment:
        "Good build quality and performance. Delivery was also quick.",
    },
  ],
  "2": [
    {
      id: 1,
      name: "Daniel",
      rating: 5,
      date: "Recently",
      comment:
        "Very good gaming performance and plenty of storage.",
    },
    {
      id: 2,
      name: "Alex",
      rating: 5,
      date: "Recently",
      comment:
        "The laptop performs really well for gaming and multitasking.",
    },
  ],
};

export default function ProductDetailsPage() {
  const params = useParams();
  const product = products.find(
    (item) => item.id === String(params.id)
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-10">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              The product you are looking for does not
              exist or may have been removed.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const reviews = reviewData[product.id] || [
    {
      id: 1,
      name: "Verified Buyer",
      rating: Math.round(product.rating),
      date: "Recently",
      comment:
        "Great product and good overall experience. The product arrived safely and works as expected.",
    },
    {
      id: 2,
      name: "Customer",
      rating: Math.max(
        1,
        Math.round(product.rating) - 1
      ),
      date: "Recently",
      comment:
        "Good quality product. I am happy with the purchase.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <Link
              href="/"
              className="transition hover:text-blue-600"
            >
              Home
            </Link>

            <ChevronRight size={15} />

            <Link
              href="/products"
              className="transition hover:text-blue-600"
            >
              Products
            </Link>

            <ChevronRight size={15} />

            <Link
              href={`/category/${product.category.toLowerCase().replaceAll(" ", "-")}`}
              className="transition hover:text-blue-600"
            >
              {product.category}
            </Link>

            <ChevronRight size={15} />

            <span className="line-clamp-1 text-gray-700">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <ProductImages
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
              <Truck
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Fast Delivery
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Reliable delivery to your address
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
              <ShieldCheck
                size={22}
                className="text-green-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Secure Shopping
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Shop with confidence on ComputerHub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50">
              <RotateCcw
                size={22}
                className="text-purple-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Easy Returns
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Simple return support for eligible items
              </p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
          <h2 className="text-xl font-bold text-gray-900">
            Product Specifications
          </h2>

          <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-lg border border-gray-200 sm:grid-cols-2">
            <Specification
              label="Brand"
              value={product.brand}
            />

            <Specification
              label="Category"
              value={product.category}
            />

            <Specification
              label="Subcategory"
              value={product.subcategory}
            />

            {product.processor && (
              <Specification
                label="Processor"
                value={product.processor}
              />
            )}

            {product.ram && (
              <Specification
                label="RAM"
                value={product.ram}
              />
            )}

            {product.storage && (
              <Specification
                label="Storage"
                value={product.storage}
              />
            )}

            {product.graphics && (
              <Specification
                label="Graphics"
                value={product.graphics}
              />
            )}

            {product.screenSize && (
              <Specification
                label="Screen Size"
                value={product.screenSize}
              />
            )}

            <Specification
              label="Availability"
              value={
                product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"
              }
            />

            <Specification
              label="Seller"
              value={product.seller}
            />
          </div>
        </section>

        {/* Reviews */}
        <ProductReviews
          reviews={reviews}
          rating={product.rating}
        />
      </section>
    </main>
  );
}

function Specification({ label, value }) {
  return (
    <div className="grid grid-cols-2 border-b border-gray-200 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r">
      <span className="text-sm font-medium text-gray-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-gray-900">
        {value || "Not specified"}
      </span>
    </div>
  );
}