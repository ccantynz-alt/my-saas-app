import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <p className="text-muted-foreground">
        System administration and internal tools.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Programmatic SEO Pages */}
        <Link
          href="/admin/program-pages"
          className="block rounded-lg border p-4 hover:bg-muted transition"
        >
          <h2 className="text-xl font-semibold">
            Programmatic SEO Pages
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate and manage KV-based SEO intent pages per project.
          </p>
        </Link>

        {/* Placeholder for future admin tools */}
        <div className="block rounded-lg border p-4 opacity-50">
          <h2 className="text-xl font-semibold">
            More tools coming
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Billing, limits, analytics, and controls.
          </p>
        </div>
      </div>
    </main>
  );
}
