import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  auth().protect();
  const user = await currentUser();

  const role = (user?.publicMetadata?.role as string | undefined) ?? "user";
  if (role !== "owner") notFound();

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-2xl font-semibold">Admin</div>
        <div className="text-sm text-zinc-500 mt-1">
          Owner-only controls will live here.
        </div>

        <div className="mt-6 border rounded-xl p-4">
          <div className="font-medium">Next admin features</div>
          <ul className="list-disc pl-5 text-sm text-zinc-700 mt-2 space-y-1">
            <li>Set user plans (starter / pro / elite)</li>
            <li>Usage + costs</li>
            <li>Model routing rules</li>
            <li>Run queue inspector</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
