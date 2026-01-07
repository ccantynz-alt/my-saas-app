// /app/billing/page.tsx
import { UpgradeToProButton } from "@/components/UpgradeToProButton";

export default function BillingPage() {
  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Billing</h1>
      <p style={{ marginTop: 12 }}>
        Upgrade to Pro to unlock higher limits.
      </p>

      <div style={{ marginTop: 18 }}>
        <UpgradeToProButton />
      </div>
    </main>
  );
}
