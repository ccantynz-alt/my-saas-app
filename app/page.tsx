export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>My SaaS App</h1>
      <p style={{ marginBottom: 16 }}>
        ✅ Deployed on Vercel. This is the home page route.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 24 }}>Quick checks</h2>
      <ul>
        <li><a href="/api/ping">/api/ping</a></li>
        <li><a href="/api/chat">/api/chat</a> (GET should now work)</li>
        <li><a href="/api/cron/tick">/api/cron/tick</a> (should return JSON, not 500)</li>
      </ul>
    </main>
  );
}
