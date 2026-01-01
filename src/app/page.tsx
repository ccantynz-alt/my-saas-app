import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>
        AI Website Builder
      </h1>

      <p style={{ marginTop: 12, fontSize: 18, color: "#555" }}>
        Chat → Runs → Agents → Output
      </p>

      <div
        style={{
          marginTop: 32,
          padding: 24,
          border: "1px solid #e5e5e5",
          borderRadius: 12,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>
          You’re signed in
        </h2>

        <p style={{ marginTop: 8, color: "#666" }}>
          Go to your dashboard to manage projects, runs, and agents.
        </p>

        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <Link
            href="/dashboard"
            style={{
              padding: "10px 16px",
              background: "#000",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Go to Dashboard
          </Link>

          <Link
            href="/dashboard/threads"
            style={{
              padding: "10px 16px",
              border: "1px solid #ccc",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Open Threads (dev)
          </Link>
        </div>
      </div>
    </main>
  );
}
