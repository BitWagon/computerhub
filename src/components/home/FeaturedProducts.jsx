"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

export default function FeaturedProducts() {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response =
          await fetch(
            "/api/products",
            {
              method: "GET",
              credentials:
                "include",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load products."
          );
        }

        let list = [];

        if (
          Array.isArray(data)
        ) {
          list = data;
        } else if (
          Array.isArray(
            data?.products
          )
        ) {
          list =
            data.products;
        } else if (
          Array.isArray(
            data?.data
          )
        ) {
          list =
            data.data;
        }

        const featured =
          list
            .filter(
              (product) =>
                product?.featured ===
                true
            )
            .slice(0, 4);

        const finalProducts =
          featured.length > 0
            ? featured
            : list.slice(0, 4);

        if (!cancelled) {
          setProducts(
            finalProducts
          );
        }
      } catch (error) {
        console.error(
          "Featured products loading error:",
          error
        );

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-main">

        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={17}
                className="text-blue-600"
              />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Featured
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Products Selected for You
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Explore products selected from the ComputerHub marketplace.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            View all products
            <ArrowRight size={17} />
          </Link>

        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Loader2
                size={20}
                className="animate-spin"
              />

              Loading products...
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(
              (product) => (
                <ProductCard
                  key={
                    product?._id?.toString?.() ||
                    product?.id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h3 className="text-lg font-black text-slate-900">
              Products will appear here
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add products through your marketplace dashboard to feature them
              on the homepage.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}