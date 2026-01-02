async function createRun() {
  const trimmed = prompt.trim();
  if (!trimmed) return;

  setCreating(true);
  setError(null);

  try {
    // 1) Create run
    const res = await fetch(`/api/projects/${projectId}/runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: trimmed }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to create run");

    const newRun = data.run as Run | undefined;

    if (newRun?.id) {
      setRuns((prev) => [newRun, ...prev]);
      setOpenRunId(newRun.id);

      // 2) Stream the run (live tokens)
      const streamRes = await fetch(
        `/api/projects/${projectId}/runs/${newRun.id}/run-stream`,
        { method: "POST" }
      );

      if (!streamRes.ok || !streamRes.body) {
        throw new Error("Failed to start streaming run");
      }

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let liveText = "";

      const applyLive = (text: string) => {
        liveText += text;
        setRuns((prev) =>
          prev.map((r) =>
            r.id === newRun.id
              ? {
                  ...r,
                  status: "running",
                  output: {
                    ...(r.output || {}),
                    summary: liveText.slice(0, 240) + (liveText.length > 240 ? "…" : ""),
                    // we’ll show full output after load()
                  },
                }
              : r
          )
        );
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events split by blank line
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event:"));
          const dataLine = lines.find((l) => l.startsWith("data:"));
          const event = eventLine?.slice(6).trim();
          const dataStr = dataLine?.slice(5).trim();

          if (!event || !dataStr) continue;

          let payload: any = null;
          try {
            payload = JSON.parse(dataStr);
          } catch {
            payload = { raw: dataStr };
          }

          if (event === "delta" && payload?.text) {
            applyLive(payload.text);
          }

          if (event === "status" && payload?.status) {
            setRuns((prev) =>
              prev.map((r) => (r.id === newRun.id ? { ...r, status: payload.status } : r))
            );
          }

          if (event === "error") {
            throw new Error(payload?.message || "Streaming error");
          }

          if (event === "done") {
            // Refresh to pull saved KV output (summary + files)
            await load();
          }
        }
      }
    } else {
      await load();
    }
  } catch (e: any) {
    setError(e?.message || "Unknown error");
  } finally {
    setCreating(false);
  }
}
