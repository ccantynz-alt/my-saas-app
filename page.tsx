export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="px-6 pt-28 pb-24 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Build a professional website
          <br className="hidden md:block" />
          in minutes — powered by AI
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Create, publish, and host conversion-ready websites without code,
          setup, or technical headaches.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/projects"
            className="px-8 py-4 rounded-lg bg-black text-white text-lg font-medium hover:bg-gray-800 transition"
          >
            Get started
          </a>

          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-lg border border-gray-300 text-lg font-medium hover:bg-gray-100 transition"
          >
            How it works
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="px-6 py-24 bg-gray-50 border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-16">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-3">1. Describe your site</h3>
              <p className="text-gray-600">
                Tell the AI what you want to build — business, product, or idea.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">2. Generate instantly</h3>
              <p className="text-gray-600">
                We generate a complete, styled website automatically.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">3. Publish & share</h3>
              <p className="text-gray-600">
                Publish with one click and share your live URL instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-16">
            Everything you need
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <ul className="space-y-4 text-gray-700">
              <li>• AI-generated layouts & copy</li>
              <li>• One-click publish</li>
              <li>• Hosted & production-ready</li>
              <li>• No setup or configuration</li>
            </ul>

            <ul className="space-y-4 text-gray-700">
              <li>• Works for beginners & developers</li>
              <li>• Custom domains (Pro)</li>
              <li>• SEO-friendly pages</li>
              <li>• Fast global hosting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Built for anyone who wants to ship faster
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you’re a founder, freelancer, agency, or just getting
            started — this platform removes friction so you can focus on results.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-28 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Ready to build your site?
        </h2>

        <p className="text-lg text-gray-600 mb-10">
          Start for free. Publish when you’re ready.
        </p>

        <a
          href="/projects"
          className="inline-block px-10 py-5 rounded-lg bg-black text-white text-lg font-medium hover:bg-gray-800 transition"
        >
          Create your website
        </a>
      </section>
    </main>
  );
}

