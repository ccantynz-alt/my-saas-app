export default function NotFound() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>Not found</h1>
      <p style={{ marginTop: 10, color: '#666' }}>
        The page you are looking for does not exist.
      </p>
      <a href="/" style={{ display: 'inline-block', marginTop: 14 }}>
        Go home
      </a>
    </div>
  );
}