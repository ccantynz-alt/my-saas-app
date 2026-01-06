export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number; body: string }> {
  const res = await fetch(input, init);

  const contentType = res.headers.get("content-type") || "";
  const bodyText = await res.text();

  // If it isn't JSON, return a helpful error that includes the response body (trimmed)
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      status: res.status,
      error: `Non-JSON response (${res.status}). Content-Type: ${contentType || "unknown"}`,
      body: bodyText.slice(0, 8000),
    };
  }

  try {
    const data = JSON.parse(bodyText) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: res.status,
      error: `Invalid JSON (${res.status}). Could not parse response body.`,
      body: bodyText.slice(0, 8000),
    };
  }
}
