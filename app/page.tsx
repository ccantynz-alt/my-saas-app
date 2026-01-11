"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  Sparkles,
  Wand2,
  Zap,
  Shield,
  Globe,
  Code2,
  Rocket,
} from "lucide-react";
import { useEffect, useRef } from "react";
import HomeDemo from "./components/HomeDemo";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/30"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-black/10"
    >
      {children}
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

/**
 * Interactive hero background: a soft spotlight that follows the pointer.
 */
function Spotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.2 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.2 });

  const x = useTransform(sx, (v) => `${v}px`);
  const y = useTransform(sy, (v) => `${v}px`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{
          left: x,
          top: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-black/10 blur-3xl"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:52px_52px] opacity-40" />
    </div>
  );
}

function Nav() {
  return (
    <div className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white shadow-sm">
              <Wand2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-zinc-900">
                MySaaS Builder
              </div>
              <div className="text-xs font-medium text-zinc-500">
                AI website automation
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              Features
            </Link>
            <Link
              href="#how"
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              Pricing
            </Link>
            <Link
              href="#demo"
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              Demo
            </Link>
            <Link
              href="/projects"
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              App
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SecondaryButton href="/projects">Open Builder</SecondaryButton>
            <div className="hidden sm:block">
              <PrimaryButton href="/projects">Start building</PrimaryButton>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-2xl font-extrabold text-zinc-900">{value}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-600">{label}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-white">
          {icon}
        </div>
        <div className="text-base font-extrabold text-zinc-900">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="absolute -top-3 left-6 rounded-full bg-black px-3 py-1 text-xs font-extrabold text-white shadow-sm">
        {number}
      </div>
      <div className="mt-2 text-base font-extrabold text-zinc-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  highlight,
  cta,
  features,
}: {
  name: string;
  price: string;
  highlight?: string;
  cta: { label: string; href: string };
  features: string[];
}) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border bg-white p-7 shadow-sm",
        highlight ? "border-black shadow-md" : "border-zinc-200 hover:shadow-md"
      )}
    >
      {highlight ? (
        <div className="absolute -top-3 left-7 rounded-full bg-black px-3 py-1 text-xs font-extrabold text-white shadow-sm">
          {highlight}
        </div>
      ) : null}

      <div className="text-sm font-extrabold text-zinc-900">{name}</div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-4xl font-extrabold tracking-tight text-zinc-900">
          {price}
        </div>
        <div className="pb-1 text-sm font-semibold text-zinc-500">/ month</div>
      </div>

      <div className="mt-5">
        {highlight ? (
          <PrimaryButton href={cta.href}>{cta.label}</PrimaryButton>
        ) : (
          <SecondaryButton href={cta.href}>{cta.label}</SecondaryButton>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {features.map((f) => (
          <div key={f} className="flex items-start gap-2 text-sm text-zinc-700">
            <Check className="mt-0.5 h-4 w-4 flex-none" />
            <span className="leading-6">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-extrabold text-zinc-900">{q}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{a}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container>
        <div className="flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-zinc-600">
            © {new Date().getFullYear()} MySaaS Builder. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-zinc-600">
            <Link href="/projects" className="hover:text-zinc-900">
              Open Builder
            </Link>
            <Link href="#pricing" className="hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="#features" className="hover:text-zinc-900">
              Features
            </Link>
            <Link href="#demo" className="hover:text-zinc-900">
              Demo
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Nav />

      {/* HERO */}
      <section className="relative">
        <Spotlight />
        <Container>
          <div className="relative py-16 md:py-24">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <Badge>Generate & publish in seconds</Badge>

                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-6xl"
                >
                  A website builder that{" "}
                  <span className="underline decoration-black/20 underline-offset-8">
                    actually ships
                  </span>
                  .
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="mt-5 text-base leading-7 text-zinc-600 md:text-lg"
                >
                  Describe what you want. We generate a conversion-ready site,
                  publish it, and give you a link instantly. Built for solo
                  founders, agencies, and teams that need momentum.
                </motion.p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PrimaryButton href="/projects">Start building now</PrimaryButton>
                  <SecondaryButton href="#demo">Try live demo</SecondaryButton>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Stat label="Time to publish" value="~30s" />
                  <Stat label="Setup required" value="None" />
                  <Stat label="Hosting" value="Vercel-ready" />
                </div>
              </div>

              {/* HERO MOCK */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full max-w-xl"
              >
                <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    </div>
                    <div className="text-xs font-semibold text-zinc-500">
                      Live preview
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="rounded-2xl bg-zinc-50 p-5">
                      <div className="text-xs font-semibold text-zinc-500">
                        Prompt
                      </div>
                      <div className="mt-2 text-sm font-semibold text-zinc-800">
                        “Create a premium website for an automation-first SaaS
                        with a hero, features, pricing, FAQ, and CTA.”
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-600">
                        <Zap className="h-4 w-4" />
                        Generated • Published • Shareable link
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="text-xs font-semibold text-zinc-500">
                          Output
                        </div>
                        <div className="mt-2 text-sm font-extrabold text-zinc-900">
                          Conversion-ready
                        </div>
                        <div className="mt-1 text-xs text-zinc-600">
                          Copy, layout, sections
                        </div>
                      </div>

                      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="text-xs font-semibold text-zinc-500">
                          Publish
                        </div>
                        <div className="mt-2 text-sm font-extrabold text-zinc-900">
                          One click
                        </div>
                        <div className="mt-1 text-xs text-zinc-600">
                          Get a public URL
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-zinc-900">
                          Ready to ship
                        </div>
                        <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-extrabold text-white">
                          Publish
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-zinc-600">
                        No meetings. No back-and-forth. Just output.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-zinc-50 py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <div className="text-sm font-extrabold text-zinc-900">
              Why people choose this
            </div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
              Premium output without the premium time sink
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600 md:text-base">
              Your builder should feel like a power tool. These are the product
              promises we can credibly deliver today.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Generate fast, publish instantly"
              text="From prompt to public URL with a reliable publish pipeline."
            />
            <Feature
              icon={<Shield className="h-5 w-5" />}
              title="Ethical conversion focus"
              text="High-trust copy, clear CTAs, no dark patterns or spammy tactics."
            />
            <Feature
              icon={<Code2 className="h-5 w-5" />}
              title="Clean handoff"
              text="Output that maps to real sections and can evolve into versioning and templates."
            />
            <Feature
              icon={<Wand2 className="h-5 w-5" />}
              title="Prompt-to-structure"
              text="Consistent page sections: hero, value props, proof, pricing, FAQ, CTA."
            />
            <Feature
              icon={<Globe className="h-5 w-5" />}
              title="Built to scale later"
              text="Start simple (MVP), then upgrade to persistence and auth without rewriting UX."
            />
            <Feature
              icon={<Rocket className="h-5 w-5" />}
              title="Momentum-first"
              text="Make shipping the default."
            />
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <div className="text-sm font-extrabold text-zinc-900">
              How it works
            </div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
              Three steps. No drama.
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600 md:text-base">
              Minimal steps, maximum output.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Step
              number="1"
              title="Describe the site"
              text="Tell us what you’re building and who it’s for."
            />
            <Step
              number="2"
              title="Generate & preview"
              text="Review output instantly. Iterate until it matches your vibe."
            />
            <Step
              number="3"
              title="Publish and share"
              text="One click → public URL. Perfect for validation and MVPs."
            />
          </div>
        </Container>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-zinc-50 py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <div className="text-sm font-extrabold text-zinc-900">Pricing</div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
              Start free. Upgrade when it pays for itself.
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <PricingCard
              name="Free"
              price="$0"
              cta={{ label: "Try the builder", href: "/projects" }}
              features={["Generate & preview", "Publish via MVP pipeline", "Templates (coming soon)"]}
            />
            <PricingCard
              name="Pro"
              price="$29"
              highlight="Most popular"
              cta={{ label: "Go Pro", href: "/pricing" }}
              features={[
                "More generations / limits lifted",
                "Faster iteration workflow",
                "Branding controls (coming soon)",
              ]}
            />
            <PricingCard
              name="Team"
              price="$99"
              cta={{ label: "Contact us", href: "/projects" }}
              features={[
                "Team workflows (coming soon)",
                "Shared templates / components",
                "Publishing governance",
              ]}
            />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <div className="text-sm font-extrabold text-zinc-900">FAQ</div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
              Simple answers, no fluff
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FAQ
              q="Is this a real publish pipeline?"
              a="Yes. Publish2 is a reliable MVP path. Persistence and auth come post-launch."
            />
            <FAQ
              q="Do I need to code?"
              a="No. Start with prompts. Later, you can refine output like any Next.js project."
            />
            <FAQ
              q="Is it ethical conversion?"
              a="Yes. We optimize clarity and trust with clean layouts and straightforward CTAs."
            />
            <FAQ
              q="Can this become KV/DB-backed later?"
              a="Yes. The UX stays identical; storage swaps behind the scenes."
            />
          </div>
        </Container>
      </section>

      {/* LIVE DEMO (REAL API CALLS) */}
      <HomeDemo />

      <Footer />
    </div>
  );
}
