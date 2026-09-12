"use client";

import Link from "next/link";
import {
BarChart3,
Package,
Users,
ShoppingCart,
Store,
MessageSquare,
FolderTree,
ArrowRight,
ShieldCheck,
} from "lucide-react";

const adminSections = [
{
title: "Orders",
description: "View and manage customer orders, payment status, and order status.",
href: "/admin/orders",
icon: Package,
},
{
title: "Products",
description: "Manage ComputerHub products, prices, stock, and product information.",
href: "/admin/products",
icon: ShoppingCart,
},
{
title: "Users",
description: "View and manage registered ComputerHub customers.",
href: "/admin/users",
icon: Users,
},
{
title: "Sellers",
description: "Manage sellers and review seller information.",
href: "/admin/sellers",
icon: Store,
},
{
title: "Categories",
description: "Manage product categories and organize the marketplace.",
href: "/admin/categories",
icon: FolderTree,
},
{
title: "Reviews",
description: "Review customer product reviews and feedback.",
href: "/admin/reviews",
icon: MessageSquare,
},
];

export default function AdminPage() {
return ( <main className="min-h-screen bg-gray-50"> <section className="border-b border-gray-200 bg-white"> <div className="container-main py-10"> <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"> <div> <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600"> <ShieldCheck size={17} />
Admin Panel </div>

```
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            ComputerHub Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Manage your ComputerHub marketplace, products, customers,
            sellers, orders, categories, and reviews from one place.
          </p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
          <BarChart3 size={30} />
        </div>
      </div>
    </div>
  </section>

  <section className="py-10">
    <div className="container-main">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">
          Administration
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Select an area below to manage your ComputerHub marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {section.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {section.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-blue-600">
                Manage {section.title}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>

  <section className="pb-12">
    <div className="container-main">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Protected Administration Area
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Only users with the admin role should be able to access
              these administration pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>


);
}
