import AgentsClient from "./AgentsClient";

export default function AgentsPage({
  params,
}: {
  params: { projectId: string };
}) {
  return <AgentsClient projectId={params.projectId} />;
}
