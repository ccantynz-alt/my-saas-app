'use client';

import React, { useEffect, useMemo, useState } from 'react';

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white shadow-sm ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
}

function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }
) {
  const variant = props.variant ?? 'primary';
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-neutral-800'
      : 'bg-white text-black border border-neutral-300 hover:bg-neutral-50';
  return (
    <button {...props} className={`${base} ${styles} ${props.className ?? ''}`}>
      {props.children}
    </button>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canceled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const url = new URL(window.location.href);
    return url.searchParams.get('canceled') === '1';
  }, []);

  useEffect(() => {
    if (canceled) {
      // Just a friendly message; no extra state needed
    }
  }, [canceled]);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok || !data?.url) {
        throw new Error(data?.error || `Checkout failed (HTTP ${res.status})`);
      }

      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message || 'Checkout failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">Pricing</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Upgrade to Pro to create unlimited projects.
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
            >
              Back to Projects
            </a>
          </div>
        </div>

        {canceled ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Checkout was canceled. No worries — you can upgrade anytime.
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 whitespace-pre-wrap">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <div className="p-6">
              <div className="text-sm font-semibold text-neutral-700">Free</div>
              <div className="mt-2 text-3xl font-semibold text-neutral-900">$0</div>
              <div className="mt-1 text-sm text-neutral-600">Great for trying it out</div>

              <ul className="mt-5 space-y-2 text-sm text-neutral-700">
                <li>• 1 project</li>
                <li>• Basic access</li>
              </ul>

              <div className="mt-6">
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
                >
                  Use Free
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-neutral-900">
            <div className="p-6">
              <div className="text-sm font-semibold text-neutral-900">Pro</div>
              <div className="mt-2 text-3xl font-semibold text-neutral-900">Monthly</div>
              <div className="mt-1 text-sm text-neutral-600">Unlimited projects + future features</div>

              <ul className="mt-5 space-y-2 text-sm text-neutral-800">
                <li>• Unlimited projects</li>
                <li>• Better workflow for builders</li>
                <li>• Designed for real businesses</li>
              </ul>

              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={startCheckout} disabled={loading} variant="primary">
                  {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro'}
                </Button>

                <div className="text-xs text-neutral-500">
                  You’ll be redirected to Stripe Checkout securely.
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 text-xs text-neutral-500">
          Note: Your plan updates via Stripe webhook → KV key <code>plan:clerk:&lt;userId&gt;</code>.
        </div>
      </div>
    </div>
  );
}
