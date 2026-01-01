import { auth } from "@clerk/nextjs/server";

export function getCurrentUserId(): string {
  const { userId } = auth();
  return userId ?? "demo";
}
