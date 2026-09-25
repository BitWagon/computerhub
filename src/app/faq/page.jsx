const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "Add the products you want to your cart, open checkout, enter your delivery information and select Cash on Delivery.",
  },
  {
    question: "Does ComputerHub support Cash on Delivery?",
    answer:
      "Yes. Cash on Delivery is currently the available payment method. You pay the courier when your order is delivered.",
  },
  {
    question: "Can I pay by credit or debit card?",
    answer:
      "Online card payments are not connected yet. A live payment gateway will be added in a future phase.",
  },
  {
    question: "Can I use a digital wallet?",
    answer:
      "Digital wallet payments are planned for a future payment-gateway phase and are not currently enabled.",
  },
  {
    question: "Where can I see my orders?",
    answer:
      "After signing in, you can open the Orders section from your account area to view your orders.",
  },
  {
    question: "Can sellers manage their products?",
    answer:
      "Yes. Authorized sellers can manage their products and seller orders through the seller dashboard.",
  },
  {
    question: "How can I contact ComputerHub?",
    answer:
      "Use the Contact Us page to send your enquiry to ComputerHub.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Customer Help
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            Find answers to common questions about shopping,
            payments, orders and ComputerHub.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold text-gray-900">
                <div className="flex items-center justify-between gap-4">
                  <span>{faq.question}</span>

                  <span className="text-xl text-blue-600 transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>

              <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-7 text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}