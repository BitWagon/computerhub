"use client";

import {
  Banknote,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
}) {
  const paymentMethodIsCod = paymentMethod === "cod";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Payment Method
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to pay for your ComputerHub order.
        </p>
      </div>

      {/* Cash on Delivery */}
      <button
        type="button"
        onClick={() => setPaymentMethod("cod")}
        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
          paymentMethodIsCod
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            paymentMethodIsCod
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Banknote size={23} />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              Cash on Delivery
            </h3>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
              AVAILABLE
            </span>
          </div>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            Pay in cash when your ComputerHub order is delivered.
          </p>
        </div>

        {/* Radio */}
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            paymentMethodIsCod
              ? "border-blue-600"
              : "border-gray-300"
          }`}
        >
          {paymentMethodIsCod && (
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          )}
        </div>
      </button>

      {/* COD information */}
      {paymentMethodIsCod && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-green-900">
                Cash on Delivery selected
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-800">
                You do not need to pay online. Your order will be
                confirmed first, and you will pay the courier in cash
                when your package arrives.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Payment
              </p>

              <p className="mt-1 text-sm font-medium text-green-900">
                Cash at delivery
              </p>
            </div>

            <div className="rounded-lg bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Order status
              </p>

              <p className="mt-1 text-sm font-medium text-green-900">
                Confirmed after checkout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Future payment methods */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">
            Credit / Debit Card
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Online card payment will be connected when a live payment
            gateway is added.
          </p>

          <span className="mt-3 inline-flex rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-600">
            COMING SOON
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">
            Digital Wallet
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Digital wallet payments will be connected in a future
            payment-gateway phase.
          </p>

          <span className="mt-3 inline-flex rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-600">
            COMING SOON
          </span>
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
        <ShieldCheck
          className="mt-0.5 shrink-0 text-green-600"
          size={22}
        />

        <div>
          <p className="text-sm font-semibold text-gray-800">
            Secure Checkout
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Your order and delivery information is submitted securely.
            ComputerHub currently accepts Cash on Delivery.
          </p>
        </div>
      </div>
    </div>
  );
}