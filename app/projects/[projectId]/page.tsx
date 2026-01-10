<button
  disabled={busy}
  onClick={async () => {
    if (!projectId) return;
    setBusy(true);
    setToast(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/auto`, { method: "POST" });
      const text = await res.text();

      if (!res.ok) {
        setToast({
          tone: "danger",
          title: "Auto build failed",
          message: text,
        });
        return;
      }

      setToast({
        tone: "success",
        title: "Website created",
        message: "Your site is live. Loading preview…",
      });

      await loadPreview();
      await runAudit();
    } catch (err: any) {
      setToast({
        tone: "danger",
        title: "Auto build error",
        message: err?.message || "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }}
  style={{
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #ddd",
    background: busy ? "#f3f4f6" : "#16a34a",
    color: busy ? "#777" : "white",
    cursor: busy ? "not-allowed" : "pointer",
    fontWeight: 900,
  }}
>
  🚀 Create & Publish My Website
</button>
