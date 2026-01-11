export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  return new Response(
    JSON.stringify({
      ok: true,
      route: "publish2",
      marker: "PUBLISH2-PROJECTS-V1",
      projectId: params.projectId
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
