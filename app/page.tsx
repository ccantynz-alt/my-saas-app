// app/page.tsx
export default function HomePage() {
  return (
    <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "1rem" }}>
        <a href="/templates">Go to Templates</a>
      </div>

      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to Your AI Website Builder
      </h1>

      <p style={{ fontSize: "1.2rem", maxWidth: 700 }}>
        Create projects, generate websites, and publish them.
      </p>
    </main>
  );
}
