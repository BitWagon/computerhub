import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

function ProductsLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-10">
        <div className="animate-pulse">
          <div className="h-10 w-64 rounded-lg bg-gray-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="h-96 rounded-2xl bg-gray-200" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-3 xl:grid-cols-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-96 rounded-2xl bg-gray-200"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient />
    </Suspense>
  );
}