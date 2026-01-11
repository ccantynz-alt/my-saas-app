export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      deployCheck: true,
      timestamp: Date.now()
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
