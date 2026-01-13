// projects/[projectId]/page.tsx

import type { Metadata } from "next";
import { getProjectTemplateId } from "@/app/lib/projectTemplateStore";
import { getProjectScaffold, hasScaffoldApplied, setProjectScaffold } from "@/app/lib/projectScaffoldStore";
import { buildScaffoldForTemplate } from "@/app/lib/templateScaffolds";

export const metadata: Metadata = {
  title: "Project Builder",
  description: "Project builder view (bootstrap scaffold V1).",
};

export default async function Page({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const templateId = await getProjectTemplateId(projectId);
  const applied = await hasScaffoldApplied(projectId);
  let scaffold = await getProjectScaffold(projectId);

  // ✅ Apply scaffold exactly once (unless already applied)
  if (templateId && !applied) {
    scaffold = buildScaffoldForTemplate(templateId);
    await setProjectScaffold(projectId, scaffold);
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
        Project Builder (Bootstrap V1)
      </h1>

      <div style={{ opacity: 0.8, marginBottom: 18 }}>
        <div><b>projectId:</b> {projectId}</div>
        <div><b>templateId:</b> {templateId ?? "null"}</div>
        <div><b>scaffold applied:</b> {String(!!(templateId && (applied || scaffold)))}</div>
      </div>

      {!templateId ? (
        <div style={{ border: "1px solid rgba(255,165,0,0.35)", background: "rgba(255,165,0,0.08)", padding: 14, borderRadius: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>No templateId found</div>
          <div style={{ opacity: 0.85 }}>
            This project was created without a template selection, or the mapping wasn’t saved.
            <br />
            If you created it from <code>/start</code>, confirm the template save route is working:
            <br />
            <code>/api/projects/{projectId}/template</code>
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 18, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Scaffold JSON (V1)</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 13 }}>
          {JSON.stringify(scaffold, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: 18, opacity: 0.75, fontSize: 14 }}>
        Next step: replace this JSON render with your real builder renderer:
        read scaffold → convert to sections/blocks → render editable UI → save project content.
      </div>
    </div>
  );
}
