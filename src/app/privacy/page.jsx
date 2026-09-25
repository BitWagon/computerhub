export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="container-main">
        <article className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: September 25, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-gray-900">
                1. Information we collect
              </h2>

              <p className="mt-3">
                ComputerHub may collect information that you provide when
                creating an account, placing an order, contacting us or
                using marketplace features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                2. How we use information
              </h2>

              <p className="mt-3">
                Information may be used to process orders, provide
                customer support, manage accounts, improve the website
                and communicate important information about your
                activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                3. Order information
              </h2>

              <p className="mt-3">
                Information necessary to deliver an order may be used
                for order processing and delivery purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                4. Security
              </h2>

              <p className="mt-3">
                We take reasonable measures to protect information
                handled through the website. No internet service can
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                5. Contact
              </h2>

              <p className="mt-3">
                For privacy questions, contact ComputerHub through the
                Contact page.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}