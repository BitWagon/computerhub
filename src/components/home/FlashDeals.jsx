"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Flame,
  Loader2,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

export default function FlashDeals() {
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

        const saleProducts =
          list
            .filter(
              (product) => {
                const price =
                  Number(
                    product?.price
                  ) || 0;

                const oldPrice =
                  Number(
                    product?.oldPrice
                  ) || 0;

                return (
                  oldPrice >
                    price &&
                  price > 0
                );
              }
            )
            .slice(0, 4);

        if (!cancelled) {
          setProducts(
            saleProducts
          );
        }
      } catch (error) {
        console.error(
          "Flash deals loading error:",
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
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="container-main">

        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Flame
                size={18}
                className="text-orange-500"
              />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                Limited Offers
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Deals Worth Checking
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Discover current price drops and selected technology deals.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            Shop all deals
            <ArrowRight size={17} />
          </Link>

        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Loader2
                size={20}
                className="animate-spin"
              />

              Loading offers...
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
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h3 className="text-lg font-black text-slate-900">
              New offers are coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Browse the complete marketplace to discover the latest products.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse Products
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}