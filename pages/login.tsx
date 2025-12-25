import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Container } from "../components/Container";
import { ButtonLink } from "../components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST" });
      if (!res.ok) throw new Error("Login failed");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login — Placeholder</title>
        <meta name="description" content="Log in to your account." />
      </Head>

      <Container>
        <section className="section" style={{ maxWidth: 520 }}>
          <h1 className="h1">Login</h1>
          <p className="p">Prototype login. We’ll wire real auth next.</p>

          <form onSubmit={onLogin} className="card">
            <label style={{ display: "block", marginBottom: 8 }}>Email</label>
            <input
              required
              type="email"
              placeholder="you@company.com"
              style={inputStyle}
            />

            <div style={{ height: 12 }} />

            <label style={{ display: "block", marginBottom: 8 }}>Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              style={inputStyle}
            />

            <div style={{ height: 16 }} />

            <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p style={{ marginTop: 12, color: "var(--muted)" }}>
              No account? <a className="link" href="/signup">Create one</a>
            </p>

            <p style={{ marginTop: 6, color: "var(--muted-2)", fontSize: 13 }}>
              Trial: 7 days · No credit card
            </p>
          </form>

          <div style={{ marginTop: 16 }}>
            <ButtonLink href="/">← Back to home</ButtonLink>
          </div>
        </section>
      </Container>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.85rem",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  outline: "none",
};
