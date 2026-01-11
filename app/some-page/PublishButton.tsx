"use client";

export default function PublishButton({
  action,
  projectId,
}: {
  action: (projectId: string) => Promise<void>;
  projectId: string;
}) {
  return (
    <button
      onClick={async () => {
        await action(projectId);
      }}
    >
      Publish
    </button>
  );
}
