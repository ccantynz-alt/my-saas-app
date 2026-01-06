export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; bodyPreview: string }
> {
  const res = await fetch(input, init);

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  // If server did not return JSON, show the first part of the body to debug
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      status: res.status,
      error: `Non-JSON response (${res.status}). Expected JSON but got: ${contentType || "unknown content-type"}`,
      bodyPreview: text.slice(0, 500),
    };
  }

  try {
    const data = JSON.parse(text) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: res.status,
      error: `Invalid JSON (${res.status}). Could not parse JSON body.`,
      bodyPreview: text.slice(0, 500),
    };
  }
}
