// src/app/projects/[projectId]/page.tsx

import type { Metadata } from "next";
import EditorClient from "./EditorClient";
import { getProjectTemplateId } from "@/app/lib/projectTemplateStore";
import { getProjectScaffold, hasScaffoldApplied, setProjectScaffold } from "@/app/lib/projectScaffoldStore";
import { buildScaffoldForTemplate } from "@/app/lib/templateScaffolds";
import { getProjectContent } from "@/app/lib/projectContentStore";

export const metadata: Metadata = {
  title: "Project Builder",
  description: "Project builder view (editable V1 content).",
};

export default async function Page({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const templateId = await getProjectTemplateId(projectId);

  // Ensure scaffold exists (applies once)
  const applied = await hasScaffoldApplied(projectId);
  if (templateId && !applied) {
    const scaffold = buildScaffoldForTemplate(templateId);
    await setProjectScaffold(projectId, scaffold);
  }

  const scaffold = await getProjectScaffold(projectId);
  const savedContent = await getProjectContent(projectId);

  const initialSections =
    savedContent?.sections ||
    scaffold?.sections ||
    [
      {
        id: "hero",
        type: "hero",
        heading: "Welcome",
        subheading: "No scaffold found yet.",
        items: ["Pick a template in /start"],
      },
    ];

  const source: "saved-content" | "scaffold" = savedContent ? "saved-content" : "scaffold";

  return (
    <EditorClient
      projectId={projectId}
      initialTemplateId={templateId ?? null}
      initialSections={initialSections}
      source={source}
    />
  );
}
