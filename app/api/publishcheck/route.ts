export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, marker: "PUBLISHCHECK-V1" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
