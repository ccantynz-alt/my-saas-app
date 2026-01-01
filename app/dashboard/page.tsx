import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  auth().protect();
  const user = await currentUser();

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="text-sm text-zinc-500 mt-1">
          Logged in as: {user?.emailAddresses?.[0]?.emailAddress ?? user?.id}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border rounded-xl p-4">
            <div className="font-medium">Build Studio (coming next)</div>
            <div className="text-sm text-zinc-600 mt-1">
              This is where projects will live.
            </div>
            <div className="mt-3">
              <span className="text-xs text-zinc-500">Next step:</span>{" "}
              <span className="text-sm">Projects + /studio/[projectId]</span>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <div className="font-medium">Developer Area</div>
            <div className="text-sm text-zinc-600 mt-1">
              Your existing thread UI (engine room).
            </div>
            <div className="mt-3">
              <Link className="border rounded-lg px-3 py-2 text-sm hover:bg-zinc-50 inline-block" href="/threads">
                Open Threads
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 border rounded-xl p-4">
          <div className="font-medium">Owner/Admin</div>
          <div className="text-sm text-zinc-600 mt-1">
            If you mark your account as owner in Clerk metadata, you’ll unlock /admin.
          </div>
          <div className="mt-3">
            <Link className="border rounded-lg px-3 py-2 text-sm hover:bg-zinc-50 inline-block" href="/admin">
              Go to Admin (owner only)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
