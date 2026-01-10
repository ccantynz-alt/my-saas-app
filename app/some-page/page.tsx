import { doThing } from "@/app/actions";

export default function Page() {
  return (
    <form action={doThing}>
      <input name="projectId" defaultValue="proj_123" />
      <button type="submit">Run</button>
    </form>
  );
}
