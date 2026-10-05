import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

function ProductsLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-main py-10">
          <div className="animate-pulse">
            <div className="h-5 w-44 rounded-full bg-slate-200" />

            <div className="mt-4 h-12 w-80 max-w-full rounded-xl bg-slate-200" />

            <div className="mt-4 h-5 w-[520px] max-w-full rounded bg-slate-200" />
          </div>
        </div>
      </section>

      <div className="container-main py-8">
        <div className="animate-pulse">
          <div className="h-12 w-full rounded-xl bg-slate-200" />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
            <div className="hidden h-[520px] rounded-2xl bg-slate-200 lg:block" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[430px] rounded-2xl bg-slate-200"
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