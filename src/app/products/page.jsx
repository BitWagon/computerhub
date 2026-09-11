"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import SortProducts from "@/components/products/SortProducts";

const products = [
  {
    id: 1,
    name: "Dell Inspiron 15 Laptop - Intel Core i5, 8GB RAM, 512GB SSD",
    image:
      "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=900&q=80",
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
    stock: 15,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 2,
    name: "HP Pavilion Gaming Laptop - Core i7, 16GB RAM, 1TB SSD",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80",
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
    stock: 8,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 3,
    name: "Lenovo ThinkPad Business Laptop - Core i5, 16GB RAM",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
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
    stock: 11,
    freeDelivery: true,
    featured: false,
  },
  {
    id: 4,
    name: "Apple MacBook Air M3 - 13-inch, 16GB RAM, 512GB SSD",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
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
    stock: 6,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 5,
    name: "ASUS ROG Gaming Desktop PC - Ryzen 7, 32GB RAM, RTX Graphics",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80",
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
    stock: 5,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 6,
    name: "MSI Gaming Desktop - Intel Core i7, 32GB RAM, RTX 4070",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80",
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
    stock: 4,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 7,
    name: "Samsung 27-inch 4K UHD Monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
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
    stock: 20,
    freeDelivery: true,
    featured: false,
  },
  {
    id: 8,
    name: "Acer 24-inch Gaming Monitor 165Hz",
    image:
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=900&q=80",
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
    stock: 17,
    freeDelivery: true,
    featured: false,
  },
  {
    id: 9,
    name: "Corsair 32GB DDR5 RAM Kit",
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80",
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
    stock: 30,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 10,
    name: "Samsung 1TB NVMe SSD",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
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
    stock: 42,
    freeDelivery: true,
    featured: true,
  },
  {
    id: 11,
    name: "ASUS Mechanical Gaming Keyboard RGB",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
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
    stock: 35,
    freeDelivery: true,
    featured: false,
  },
  {
    id: 12,
    name: "Logitech Wireless Gaming Mouse",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
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
    stock: 50,
    freeDelivery: true,
    featured: false,
  },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    ram: [],
    storage: [],
    minPrice: "",
    maxPrice: "",
    rating: null,
  });

  const [sort, setSort] = useState("featured");

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      ram: [],
      storage: [],
      minPrice: "",
      maxPrice: "",
      rating: null,
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category.length > 0) {
      result = result.filter((product) =>
        filters.category.includes(product.category)
      );
    }

    if (filters.brand.length > 0) {
      result = result.filter((product) =>
        filters.brand.includes(product.brand)
      );
    }

    if (filters.ram.length > 0) {
      result = result.filter((product) =>
        filters.ram.includes(product.ram)
      );
    }

    if (filters.storage.length > 0) {
      result = result.filter((product) =>
        filters.storage.includes(product.storage)
      );
    }

    if (filters.minPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) <= Number(filters.maxPrice)
      );
    }

    if (filters.rating) {
      result = result.filter(
        (product) =>
          Number(product.rating) >= Number(filters.rating)
      );
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;

      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;

      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured)
        );
        break;
    }

    return result;
  }, [filters, sort]);

  const activeFilterCount =
    filters.category.length +
    filters.brand.length +
    filters.ram.length +
    filters.storage.length +
    (filters.minPrice !== "" ? 1 : 0) +
    (filters.maxPrice !== "" ? 1 : 0) +
    (filters.rating ? 1 : 0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-blue-600">
            ComputerHub
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            All Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Browse laptops, desktops, components, monitors,
            accessories and gaming products.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile Filter Button */}
        <div className="mb-5 lg:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700"
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products */}
          <section>
            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Active filters:
                </span>

                {filters.category.map((item) => (
                  <span
                    key={`category-${item}`}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}

                {filters.brand.map((item) => (
                  <span
                    key={`brand-${item}`}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}

                {filters.ram.map((item) => (
                  <span
                    key={`ram-${item}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}

                {filters.storage.map((item) => (
                  <span
                    key={`storage-${item}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}

                {filters.minPrice !== "" && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Min ${filters.minPrice}
                  </span>
                )}

                {filters.maxPrice !== "" && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Max ${filters.maxPrice}
                  </span>
                )}

                {filters.rating && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {filters.rating}+ Stars
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2 text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            )}

            <SortProducts
              value={sort}
              onChange={setSort}
              productCount={filteredProducts.length}
            />

            <div className="mt-5">
              <ProductGrid products={filteredProducts} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}