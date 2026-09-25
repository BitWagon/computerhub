export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="container-main">
        <article className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900">
            Cookie Policy
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: September 25, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-gray-900">
                1. What are cookies?
              </h2>

              <p className="mt-3">
                Cookies are small pieces of information stored by your
                browser that can help websites remember settings and
                provide a better experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                2. How ComputerHub uses browser storage
              </h2>

              <p className="mt-3">
                ComputerHub may use browser storage and similar
                technologies to remember shopping-related information,
                such as cart and checkout information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                3. Account sessions
              </h2>

              <p className="mt-3">
                Login and session information may be stored or handled
                by the application so protected areas can work correctly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">
                4. Managing browser storage
              </h2>

              <p className="mt-3">
                You can manage cookies and browser storage through your
                browser settings. Disabling some storage features may
                affect parts of the website.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}