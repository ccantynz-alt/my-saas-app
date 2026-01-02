// app/lib/isAdmin.ts
import { getCurrentUserId } from "./demoAuth";

/**
 * Minimal admin check for now.
 * If you switch to Clerk later, we’ll replace this with Clerk auth/roles.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    return !!userId;
  } catch {
    return false;
  }
}
