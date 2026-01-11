import "server-only";

type Store = {
  htmlByProject: Map<string, string>;
};

const g = globalThis as any;

export function getStore(): Store {
  if (!g.__MY_SAAS_STORE__) {
    g.__MY_SAAS_STORE__ = {
      htmlByProject: new Map<string, string>(),
    } satisfies Store;
  }
  return g.__MY_SAAS_STORE__ as Store;
}

export function setProjectHtml(projectId: string, html: string) {
  getStore().htmlByProject.set(projectId, html);
}

export function getProjectHtml(projectId: string) {
  return getStore().htmlByProject.get(projectId) ?? null;
}
