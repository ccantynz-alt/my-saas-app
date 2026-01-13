import type { Metadata } from "next";
import { Suspense } from "react";
import StartClient from "./StartClient";

export const metadata: Metadata = {
  title: "Start",
  description: "Start a project and open the builder.",
  robots: { index: true, follow: true },
};

export default function StartPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
      <StartClient />
    </Suspense>
  );
}
