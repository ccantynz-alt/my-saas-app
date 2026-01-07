"use client";

export default function BillingPage() {
  async function subscribe() {
    const userId = "demo-user"; // replace later with real auth

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to start checkout");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Upgrade</h1>
      <p>Subscribe to unlock full access.</p>

      <button
        onClick={subscribe}
        style={{ padding: "12px 20px", marginTop: 16 }}
      >
        Subscribe
      </button>
    </main>
  );
}
