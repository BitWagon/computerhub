"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FolderTree,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

const adminSections = [
  {
    title: "Orders",
    description:
      "Manage customer orders, delivery progress, and payment status.",
    href: "/admin/orders",
    icon: Package,
  },
  {
    title: "Products",
    description:
      "Manage products, pricing, inventory, and marketplace listings.",
    href: "/admin/products",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    description:
      "View and manage registered ComputerHub customer accounts.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Sellers",
    description:
      "Manage marketplace sellers and seller information.",
    href: "/admin/sellers",
    icon: Store,
  },
  {
    title: "Categories",
    description:
      "Organize marketplace categories and product navigation.",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Reviews",
    description:
      "Review customer feedback and manage product reviews.",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
];

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!mounted) {
          return;
        }

        if (!response.ok || !data.success) {
          window.location.replace("/admin/login");
          return;
        }

        if (data.user?.role !== "admin") {
          window.location.replace("/admin/login");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Admin dashboard authentication error:",
          error
        );

        if (mounted) {
          window.location.replace("/admin/login");
        }
      }
    }

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <ShieldCheck size={15} />
                Secure Admin Panel
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                ComputerHub
                <span className="block text-slate-500">
                  Administration
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your marketplace operations, products,
                customers, sellers, and orders from one
                centralized workspace.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg">
              <BarChart3 size={34} />
            </div>
          </div>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Control Center
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Marketplace Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Select a section to manage your ComputerHub
              marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {adminSections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-slate-100 group-hover:text-slate-900">
                      <ArrowRight
                        size={18}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-950">
                    {section.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                    {section.description}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-slate-800">
                      Manage {section.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h3 className="font-bold text-slate-950">
                  Protected Administration Area
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Administrative tools are restricted to
                  authorized administrator accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}