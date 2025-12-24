// lib/keys.ts
export const keys = {
  // Projects
  project: (projectId: string) => `project:${projectId}`,
  projectIdsByOwner: (ownerId: string) => `projectIdsByOwner:${ownerId}`, // Set
  projectsIndexByOwner: (ownerId: string) => `projectsIndexByOwner:${ownerId}`, // Sorted set (by updatedAt ms)

  // Runs
  run: (runId: string) => `run:${runId}`,
  runIdsByProject: (projectId: string) => `runIdsByProject:${projectId}`, // Sorted set (by createdAt ms)
  runIdsByOwner: (ownerId: string) => `runIdsByOwner:${ownerId}`, // Sorted set

  // Logs
  runLogs: (runId: string) => `runLogs:${runId}`, // List
};
