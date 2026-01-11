import { publishProject } from "@/app/actions";

export default function Page() {
  const projectId = "REPLACE_ME_WITH_REAL_PROJECT_ID";

  return (
    <div style={{ padding: 24 }}>
      <h1>Publish</h1>

      {/* Server Action must be used as a form action */}
      <form
        action={async () => {
          "use server";
          await publishProject(projectId);
        }}
      >
        <button type="submit">Publish project</button>
      </form>
    </div>
  );
}
