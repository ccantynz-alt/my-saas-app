"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Sub = {
  status?: string;
  customerId?: string;
  subscriptionId?: string;
  updatedAt?: number;
};

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Sub | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/me/subscription", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await res.json();
      setSub(data?.subscription || null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }

  async function subscribe() {
    setStarting(true);
    setErr(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await res.json();
      if (!data?.ok || !data?.url) {
        setErr(data?.error || "Failed to start checkout");
        setStarting(false);
        return;
      }
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Failed to start checkout");
    } finally {
      setStarting(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const status = sub?.status || "none";
  const isActive = status === "active";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>Billing</h1>
          <div style={{ opacity: 0.75, marginTop: 6 }}>Manage your subscription</div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/projects" style={{ textDecoration: "underline" }}>Projects</Link>
          <Link href="/templates" style={{ textDecoration: "underline" }}>Templates</Link>
          <Link href="/admin" style={{ textDecoration: "underline" }}>Admin</Link>
        </div>
      </div>

      <hr style={{ margin: "18px 0" }} />

      {err && (
        <div style={{ background: "#ffe9e9", border: "1px solid #ffbcbc", padding: 12, borderRadius: 8 }}>
          <b>Error:</b> {err}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 16 }}>
            <b>Status:</b>{" "}
            <span style={{ padding: "2px 8px", borderRadius: 999, border: "1px solid #ddd" }}>
              {status}
            </span>
          </div>

          {isActive ? (
            <div style={{ marginTop: 10, opacity: 0.85 }}>
              ✅ You are subscribed.
              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
                Customer: {sub?.customerId || "—"} <br />
                Subscription: {sub?.subscriptionId || "—"}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.85, marginBottom: 10 }}>
                Upgrade to Pro to unlock premium features.
              </div>
              <button
                onClick={subscribe}
                disabled={starting}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {starting ? "Starting Checkout..." : "Subscribe (Pro)"}
              </button>
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <button
              onClick={load}
              style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
