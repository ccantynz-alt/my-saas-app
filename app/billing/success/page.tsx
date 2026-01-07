// /app/billing/success/page.tsx
import Link from "next/link";

export default function BillingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Payment successful ✅</h1>
      <p style={{ marginTop: 12 }}>
        Stripe checkout completed. (Next step: webhook will mark you as Pro.)
      </p>

      <pre style={{ marginTop: 16, padding: 12, background: "#f6f6f6", borderRadius: 10 }}>
        session_id: {searchParams?.session_id ?? "(none)"}
      </pre>

      <p style={{ marginTop: 16 }}>
        <Link href="/">Go back home</Link>
      </p>
    </main>
  );
}
