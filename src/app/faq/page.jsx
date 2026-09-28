"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-12">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <HelpCircle size={28} />
          </div>

          <h1 className="text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h1>

          <p className="mt-3 text-slate-600">
            Find quick answers about orders, payments, delivery, returns,
            warranties, and your ComputerHub account.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-slate-900">
                    {faq.question}
                  </span>

                  {isOpen ? (
                    <ChevronUp className="text-blue-600" size={22} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={22} />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 py-5">
                    <p className="leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Box */}
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">
            Still need help?
          </h2>

          <p className="mt-2 text-blue-100">
            Our support team is here to help with orders, products, and seller inquiries.
          </p>

          <a
            href="/contact"
            className="mt-5 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-slate-100"
          >
            Contact Support
          </a>
        </div>

      </div>
    </main>
  );
}