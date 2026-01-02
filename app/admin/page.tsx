// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminAccessPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    setOk(null);
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      const data = await res.json();
      setIsAdmin(!!data?.ok && !!data?.admin);
    } catch (e: any) {
      setErr(e?.message || "Failed to check admin status");
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Login failed");
      setOk("Admin access granted.");
      setCode("");
      await refresh();
      // Send admin to dashboard immediately
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Logout failed");
      setOk("Logged out.");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Logout failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 760 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Admin Access</h1>
      <p style={{ marginTop: 8, opacity: 0.75, lineHeight: 1.5 }}>
        Use this page to access the builder when the site is in Public Mode.
      </p>

      <div
        style={{
          marginTop: 16,
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        {loading ? (
          <div style={{ opacity: 0.75 }}>Checking admin status…</div>
        ) : isAdmin ? (
          <>
            <div style={{ fontWeight: 900 }}>You are signed in as Admin ✅</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="/dashboard"
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Go to Dashboard
              </a>
              <a
                href="/projects"
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Go to Projects
              </a>
              <button
                onClick={logout}
                disabled={saving}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.65 : 1,
                  fontWeight: 800,
                }}
              >
                {saving ? "Working…" : "Logout"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>
              Enter Admin Access Code
            </div>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Admin access code"
              type="password"
              style={{
                width: "100%",
                padding: "12px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button
                onClick={login}
                disabled={saving || !code.trim()}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  cursor: saving || !code.trim() ? "not-allowed" : "pointer",
                  opacity: saving || !code.trim() ? 0.65 : 1,
                  fontWeight: 800,
                }}
              >
                {saving ? "Signing in…" : "Login"}
              </button>

              <button
                onClick={refresh}
                disabled={saving}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.65 : 1,
                  fontWeight: 800,
                }}
              >
                Refresh
              </button>
            </div>
          </>
        )}

        {(err || ok) && (
          <div style={{ marginTop: 14 }}>
            {err && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.08)",
                  fontSize: 13,
                }}
              >
                {err}
              </div>
            )}
            {ok && (
              <div
                style={{
                  marginTop: err ? 10 : 0,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,255,0,0.18)",
                  background: "rgba(0,255,0,0.07)",
                  fontSize: 13,
                }}
              >
                {ok}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Setup required</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            You must set an environment variable: <code>ADMIN_ACCESS_CODE</code>
          </li>
          <li>
            Use Vercel Project → Settings → Environment Variables (Production + Preview)
          </li>
        </ul>
      </div>
    </div>
  );
}
