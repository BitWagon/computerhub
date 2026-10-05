"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
} from "lucide-react";

const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "Browse products, add your items to the cart, proceed to checkout, enter your delivery details, and confirm your order.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes. Cash on Delivery is available on selected products and eligible locations across Pakistan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery, debit cards, credit cards, and supported digital payment methods where available.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 2–5 business days depending on your location and product availability.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. After your order is confirmed, you can view its latest status from your Orders page.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Eligible products can be returned within the return period if they meet our return policy conditions.",
  },
  {
    question: "Do products include a warranty?",
    answer:
      "Many products include an official brand warranty. Warranty information is displayed on the product page when applicable.",
  },
  {
    question: "Can sellers manage their own products?",
    answer:
      "Yes. Approved sellers can add products, update stock, manage pricing, and track orders through the Seller Dashboard.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return (
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="container-main py-14 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <HelpCircle size={28} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              Help Center
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Quick answers about orders, payments, delivery, returns,
              warranties and your ComputerHub account.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your question..."
                  className="w-full rounded-2xl border border-white/10 bg-white px-12 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-main py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">
              {filteredFaqs.length}{" "}
              {filteredFaqs.length === 1 ? "question" : "questions"}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const index = faqs.indexOf(faq);
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-sm font-black leading-6 text-slate-900 sm:text-base">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                      <p className="max-w-3xl text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <HelpCircle
                size={34}
                className="mx-auto text-slate-400"
              />

              <h2 className="mt-4 text-xl font-black text-slate-900">
                No matching questions
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try another search or contact our support team.
              </p>

              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Contact Support
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Support CTA */}
      <section className="container-main pb-14 sm:pb-20">
        <div className="rounded-3xl bg-blue-600 p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <MessageCircle size={20} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                  Need more help?
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                Our support team is here for you.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Contact us for help with products, orders, accounts or
                seller enquiries.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 hover:bg-slate-100"
            >
              Contact Support
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}