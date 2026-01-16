// src/app/p/[projectId]/about/page.tsx
import { redirect } from "next/navigation";

export default function PublishedAboutPage({
  params,
}: {
  params: { projectId: string };
}) {
  redirect(`/p/${params.projectId}`);
}
