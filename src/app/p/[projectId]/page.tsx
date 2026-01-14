import type { Metadata } from "next";
import PublicRenderer from "./PublicRenderer";
import { getPublishedMetadata } from "./publishedSeo";

type PageProps = {
  params: { projectId: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return await getPublishedMetadata({ projectId: params.projectId, pageSlug: "" });
}

export default function PublishedHomePage({ params }: PageProps) {
  return <PublicRenderer projectId={params.projectId} />;
}
