'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui', padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Global error</h1>
        <p style={{ marginTop: 10, color: '#666' }}>
          The app hit an unrecoverable error.
        </p>

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#111',
            color: '#eee',
            borderRadius: 8,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {String(error?.message ?? error)}
        </pre>

        <button
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}