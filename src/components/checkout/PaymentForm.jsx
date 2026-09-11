"use client";

import {
  Banknote,
  CreditCard,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
}) {
  const methods = [
    {
      id: "card",
      title: "Credit / Debit Card",
      description: "Pay securely using your bank card",
      icon: CreditCard,
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: Banknote,
    },
    {
      id: "wallet",
      title: "Digital Wallet",
      description: "Pay using your supported digital wallet",
      icon: Wallet,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Payment Method
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to pay for your order.
        </p>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const selected = paymentMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon size={21} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {method.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {method.description}
                </p>
              </div>

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selected
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {paymentMethod === "card" && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 font-semibold text-gray-900">
            Card Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="cardNumber"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Card Number
              </label>

              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiry"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Expiry Date
                </label>

                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="cvv"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  CVV
                </label>

                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="•••"
                  maxLength={4}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cardName"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Name on Card
              </label>

              <input
                id="cardName"
                type="text"
                autoComplete="cc-name"
                placeholder="Enter name on card"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <p className="text-xs leading-5 text-gray-500">
              Card details are only displayed for checkout UI. A real
              payment gateway should process card information securely
              before accepting live payments.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            You will pay the delivery amount in cash when your
            ComputerHub order arrives.
          </p>
        </div>
      )}

      {paymentMethod === "wallet" && (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            Digital wallet payment integration will be connected
            during the payment gateway phase.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
        <ShieldCheck
          className="shrink-0 text-green-600"
          size={22}
        />

        <div>
          <p className="text-sm font-semibold text-gray-800">
            Secure Payment
          </p>

          <p className="text-xs text-gray-500">
            Your payment information will be securely processed.
          </p>
        </div>
      </div>
    </div>
  );
}