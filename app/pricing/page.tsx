import Link from "next/link";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-sm text-gray-600">Pricing</p>
          <h1 className="text-3xl font-bold">
            Simple pricing that grows with you
          </h1>
          <p className="text-gray-700 max-w-2xl">
            Start free, then upgrade when you’re ready to publish more sites,
            connect custom domains, and unlock priority generation.
          </p>
        </header>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Free</h2>
              <p className="text-gray-600">Try it out and build your first site.</p>
              <div className="text-3xl font-bold">
                $0 <span className="text-base font-normal text-gray-600">/ month</span>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ 1 project</li>
              <li>✅ 1 published website</li>
              <li>✅ Basic AI generation</li>
              <li>❌ Custom domains</li>
              <li>❌ Priority generation</li>
            </ul>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Continue on Free
              </Link>
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border p-6 space-y-5 bg-black text-white">
            <div className="space-y-2">
              <div className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs">
                Most Popular
              </div>
              <h2 className="text-xl font-semibold">Pro</h2>
              <p className="text-white/80">
                For creators and small businesses who want to publish without limits.
              </p>
              <div className="text-3xl font-bold">
                $29 <span className="text-base font-normal text-white/70">/ month</span>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-white/90">
              <li>✅ Unlimited projects</li>
              <li>✅ Unlimited published sites</li>
              <li>✅ Custom domains</li>
              <li>✅ Priority AI generation</li>
              <li>✅ Future automation features included</li>
            </ul>

            <div className="pt-2 space-y-2">
              {/* Stripe / checkout is wired in the NEXT step.
                  For now, this button routes to /upgrade so you can test the flow. */}
              <Link
                href="/upgrade"
                className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100"
              >
                Upgrade to Pro
              </Link>

              <p className="text-xs text-white/70 text-center">
                Cancel anytime. Secure payments.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="rounded-2xl border p-6 space-y-4">
          <h3 className="text-lg font-semibold">FAQ</h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900">Can I cancel anytime?</p>
              <p>Yes — you can cancel whenever you want. You’ll keep access until the end of your billing period.</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Do I own my website?</p>
              <p>Yes — your generated content is yours. You can publish and use it for your business.</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Do I need a credit card to try it?</p>
              <p>No — the Free plan lets you try it without a credit card.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-xs text-gray-500">
          Tip: For now we’re keeping everything on the Vercel URL until monetisation is fully working.
        </footer>
      </div>
    </div>
  );
}
