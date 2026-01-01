export type RunStatus = "queued" | "running" | "completed" | "failed";

export type Run = {
  id: string;
  projectId: string;
  status: RunStatus;
  prompt?: string;
  createdAt: string;
};

export function nowISO() {
  return new Date().toISOString();
}
