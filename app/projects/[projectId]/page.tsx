async function publishNow() {
  if (!projectId) return false;

  setToast(null);
  setPublish({ state: "publishing" });

  try {
    const res = await fetch(`/api/projects/${projectId}/publish`, { method: "POST" });
    const text = await res.text();

    // ✅ Paywall: show upgrade link
    if (res.status === 402) {
      let upgradeUrl = "";
      try {
        const data = JSON.parse(text);
        if (typeof data?.upgradeUrl === "string") upgradeUrl = data.upgradeUrl;
      } catch {}

      setPublish({ state: "error", message: "Upgrade to Pro required to publish." });

      setToast({
        tone: "danger",
        title: "Upgrade required",
        message:
          upgradeUrl
            ? `Publishing is a Pro feature.\n\nOpen this link to upgrade:\n${upgradeUrl}`
            : "Publishing is a Pro feature. (No upgrade link returned — check billing route/env vars.)",
      });

      return false;
    }

    if (!res.ok) {
      setPublish({ state: "error", message: `(${res.status}) ${text}` });
      setToast({ tone: "danger", title: "Publish failed", message: `(${res.status}) ${text}` });
      return false;
    }

    let urlFromApi = "";
    try {
      const data = JSON.parse(text);
      urlFromApi =
        (typeof data?.url === "string" && data.url) ||
        (typeof data?.path === "string" && data.path) ||
        (typeof data?.publicUrl === "string" && data.publicUrl) ||
        "";
    } catch {
      urlFromApi = text.trim();
    }

    if (!urlFromApi) {
      setPublish({ state: "error", message: `Unexpected publish response: ${text}` });
      setToast({ tone: "danger", title: "Publish error", message: `Unexpected publish response: ${text}` });
      return false;
    }

    setPublish({ state: "published", url: urlFromApi });
    setToast({ tone: "success", title: "Published", message: normalizePublishedUrl(urlFromApi) });
    return true;
  } catch (err: any) {
    setPublish({ state: "error", message: err?.message ? String(err.message) : "Unknown error during publish." });
    setToast({
      tone: "danger",
      title: "Publish error",
      message: err?.message ? String(err.message) : "Unknown error during publish.",
    });
    return false;
  }
}
