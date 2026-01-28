"use client";

import React, { useEffect, useMemo, useState } from "react";

const ui = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(125, 90, 255, 0.18), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(255, 200, 90, 0.10), transparent 60%), #07060b",
    color: "rgba(246,242,255,0.92)",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  } as const,
  shell: { width: "100%", maxWidth: 1160, margin: "0 auto", padding: "20px 16px 28px 16px" } as const,
  card: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
    padding: 14,
  } as const,
  h1: { margin: 0, fontSize: 22, lineHeight: 1.1, fontWeight: 950, letterSpacing: "-0.01em" } as const,
  p: { margin: "10px 0", lineHeight: 1.6, color: "rgba(237,234,247,0.76)", fontSize: 14 } as const,
  input: {
    width: "100%",
    borderRadius: 12,
    padding: "10px 12px",
    outline: "none",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(246,242,255,0.92)",
    fontSize: 14,
  } as const,
  btn: {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(246,242,255,0.92)",
    cursor: "pointer",
    fontWeight: 900,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  } as const,
  btnHot: {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(255,215,140,0.25)",
    background: "linear-gradient(135deg, rgba(255,215,140,0.18), rgba(125, 90, 255, 0.10))",
    color: "rgba(246,242,255,0.96)",
    cursor: "pointer",
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  } as const,
  pill: (s: string) =>
    ({
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 950,
      padding: "6px 10px",
      borderRadius: 999,
      border:
        s === "approved"
          ? "1px solid rgba(140,255,200,0.25)"
          : s === "scheduled"
          ? "1px solid rgba(160,210,255,0.25)"
          : s === "published"
          ? "1px solid rgba(255,215,140,0.25)"
          : "1px solid rgba(255,255,255,0.14)",
      background:
        s === "approved"
          ? "rgba(140,255,200,0.07)"
          : s === "scheduled"
          ? "rgba(160,210,255,0.07)"
          : s === "published"
          ? "rgba(255,215,140,0.07)"
          : "rgba(255,255,255,0.05)",
      color: "rgba(246,242,255,0.92)",
    } as const),
};

type Item = {
  id: string;
  channel: string;
  type: string;
  title: string;
  body: string;
  status: "draft" | "approved" | "scheduled" | "published";
  scheduledForIso?: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

const CHANNELS = [
  { id: "", label: "ALL" },
  { id: "landing", label: "LANDING" },
  { id: "seo", label: "SEO" },
  { id: "blog", label: "BLOG" },
  { id: "social", label: "SOCIAL" },
  { id: "email", label: "EMAIL" },
  { id: "plan", label: "PLAN" },
  { id: "misc", label: "MISC" },
];

function isoFromLocalDateTime(dt: string) {
  // Input from <input type="datetime-local"> has no timezone; treat it as local time and convert to UTC ISO.
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export default function Page() {
  const [token, setToken] = useState("");
  const [projectId, setProjectId] = useState("demo");
  const [channel, setChannel] = useState(""); // filter
  const [topic, setTopic] = useState("Polish Dominat8 marketing for US-style conversion. Improve headlines, SEO, and funnel copy.");
  const [items, setItems] = useState<Item[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [scheduleLocal, setScheduleLocal] = useState(""); // datetime-local

  const headers = useMemo(() => (token ? { "x-admin-token": token } : {}), [token]);

  async function refresh() {
    setErr(null);
    setMsg(null);
    const qs = new URLSearchParams({ projectId });
    if (channel) qs.set("channel", channel);

    const r = await fetch(`/api/admin/marketing/queue?${qs.toString()}`, { headers, cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (!j?.ok) { setErr(j?.error || "Failed to load queue"); return; }
    setItems(j.items || []);
    const first = (j.items || [])[0];
    if (first && !sel) setSel(first.id);
  }

  useEffect(() => { refresh(); }, []);
  useEffect(() => { refresh(); }, [projectId, channel]);

  async function generateDrafts() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ projectId, topic }),
      });
      const j = await r.json().catch(() => ({}));
      if (!j?.ok) { setErr(j?.error || "Generate failed"); return; }
      setMsg(`Generated ${j.created} drafts.`);
      await refresh();
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function runSchedulerNow() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/marketing/scheduler-run", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ projectId }),
      });
      const j = await r.json().catch(() => ({}));
      if (!j?.ok) { setErr(j?.error || "Scheduler failed"); return; }
      const n = j?.result?.publishedCount ?? 0;
      setMsg(`Scheduler ran. Published ${n} due items.`);
      await refresh();
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function act(id: string, action: string, scheduledForIso?: string) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/marketing/queue-action", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ projectId, id, action, scheduledForIso }),
      });
      const j = await r.json().catch(() => ({}));
      if (!j?.ok) { setErr(j?.error || "Action failed"); return; }
      await refresh();
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function generatePatchFromApproved() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/marketing/generate-patch", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ projectId, mode: "approved" }),
      });
      const j = await r.json().catch(() => ({}));
      if (!j?.ok) { setErr(j?.error || "Patch generation failed"); return; }
      setMsg(`Patch ready: ${j.title} (${j.fileCount} files). Download patch from Bundles or button below.`);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  const selected = items.find(x => x.id === sel) || items[0];

  const patchUrl = useMemo(() => {
    const qs = new URLSearchParams({ projectId });
    return `/api/admin/bundles/patch?${qs.toString()}`;
  }, [projectId]);

  const icsUrl = useMemo(() => {
    const qs = new URLSearchParams({ projectId });
    return `/api/admin/marketing/export-ics?${qs.toString()}`;
  }, [projectId]);

  function setScheduleFromSelected() {
    if (!selected?.scheduledForIso) return;
    const d = new Date(selected.scheduledForIso);
    // convert to datetime-local string
    const pad = (n: number) => String(n).padStart(2, "0");
    const s = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setScheduleLocal(s);
  }

  return (
    <div style={ui.page}>
      <div style={ui.shell}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={ui.h1}>Admin · Marketing Machine Queue (Channels + Scheduler)</h1>
            <p style={ui.p}>
              Draft → Approve → Schedule → Scheduler publishes when due. Export calendar. Generate strict patch from approved.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/admin/bundles" style={ui.btn}>Go to Bundles →</a>
            <button style={ui.btn as any} onClick={refresh} disabled={busy}>Refresh</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 12, marginTop: 12 }}>
          <div style={ui.card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(237,234,247,0.62)" }}>ADMIN_TOKEN</div>
                <input style={ui.input} value={token} onChange={(e) => setToken(e.target.value)} placeholder="paste admin token (if set)" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(237,234,247,0.62)" }}>Project ID</div>
                <input style={ui.input} value={projectId} onChange={(e) => setProjectId(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(237,234,247,0.62)" }}>Channel Filter</div>
                <select value={channel} onChange={(e) => setChannel(e.target.value)} style={{ ...ui.input, height: 42 }}>
                  {CHANNELS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(237,234,247,0.62)" }}>Topic / Direction</div>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} style={{ ...ui.input, minHeight: 110, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
              <button style={ui.btnHot as any} onClick={generateDrafts} disabled={busy}>
                {busy ? "Working..." : "Generate Drafts"}
              </button>

              <button style={ui.btnHot as any} onClick={generatePatchFromApproved} disabled={busy}>
                Generate Patch (Approved)
              </button>

              <button style={ui.btn as any} onClick={runSchedulerNow} disabled={busy}>
                Run Scheduler Now
              </button>

              <a
                href={patchUrl}
                style={ui.btn}
                onClick={(e) => {
                  if (token) {
                    const u = new URL(patchUrl, window.location.origin);
                    u.searchParams.set("token", token);
                    (e.currentTarget as HTMLAnchorElement).href = u.pathname + u.search;
                  }
                }}
              >
                Download Patch (.ps1)
              </a>

              <a
                href={icsUrl}
                style={ui.btn}
                onClick={(e) => {
                  if (token) {
                    const u = new URL(icsUrl, window.location.origin);
                    u.searchParams.set("token", token);
                    (e.currentTarget as HTMLAnchorElement).href = u.pathname + u.search;
                  }
                }}
                title="Downloads an .ics file for scheduled items"
              >
                Export Calendar (.ics)
              </a>

              {msg && <div style={{ fontSize: 12, fontWeight: 950, color: "rgba(140,255,200,0.90)" }}>{msg}</div>}
              {err && <div style={{ fontSize: 12, fontWeight: 950, color: "rgba(255,140,140,0.92)" }}>{err}</div>}
            </div>

            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 900, color: "rgba(237,234,247,0.55)" }}>
              Scheduling uses your browser time picker; stored as UTC ISO; cron runs in UTC on Vercel.
            </div>
          </div>

          <div style={ui.card}>
            <div style={{ fontWeight: 950, fontSize: 14 }}>Queue Items</div>

            {items.length < 1 ? (
              <p style={ui.p}>No items yet. Click <b>Generate Drafts</b> to create the first queue entries.</p>
            ) : (
              <div style={{ display: "grid", gap: 8, marginTop: 10, maxHeight: 540, overflow: "auto" }}>
                {items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => { setSel(it.id); setScheduleLocal(""); }}
                    style={{
                      ...ui.btn,
                      textAlign: "left",
                      justifyContent: "space-between",
                      border: it.id === sel ? "1px solid rgba(255,215,140,0.35)" : "1px solid rgba(255,255,255,0.10)",
                      background: it.id === sel ? "rgba(255,215,140,0.06)" : "rgba(255,255,255,0.05)",
                    } as any}
                  >
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                        <div style={{ fontWeight: 950, fontSize: 12 }}>{it.title}</div>
                        <span style={ui.pill(it.status)}>{it.status.toUpperCase()}</span>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: "rgba(237,234,247,0.62)" }}>
                        channel: {it.channel} · type: {it.type}
                        {it.scheduledForIso ? ` · scheduled: ${new Date(it.scheduledForIso).toLocaleString()}` : ""}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ ...ui.card, marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontWeight: 950, fontSize: 14 }}>Selected Item</div>
            {selected && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button style={ui.btnHot as any} onClick={() => act(selected.id, "approve")} disabled={busy}>Approve</button>
                <button style={ui.btn as any} onClick={() => act(selected.id, "publish")} disabled={busy}>Mark Published</button>
                <button style={ui.btn as any} onClick={() => act(selected.id, "revert")} disabled={busy}>Revert to Draft</button>
                <button style={ui.btn as any} onClick={() => act(selected.id, "delete")} disabled={busy}>Delete</button>
              </div>
            )}
          </div>

          {!selected ? (
            <p style={ui.p}>Select an item from the right to review it.</p>
          ) : (
            <>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={ui.pill(selected.status)}>{selected.status.toUpperCase()}</span>
                <div style={{ fontWeight: 950 }}>{selected.title}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(237,234,247,0.62)" }}>
                  channel: {selected.channel} · type: {selected.type}
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(237,234,247,0.62)" }}>Schedule (local time)</div>
                  <input
                    type="datetime-local"
                    value={scheduleLocal}
                    onChange={(e) => setScheduleLocal(e.target.value)}
                    style={{ ...ui.input, height: 42 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <button style={ui.btnHot as any} disabled={busy} onClick={() => {
                    const iso = isoFromLocalDateTime(scheduleLocal);
                    if (!iso) { setErr("Invalid schedule time."); return; }
                    act(selected.id, "schedule", iso);
                  }}>
                    Schedule
                  </button>
                  <button style={ui.btn as any} disabled={busy} onClick={() => act(selected.id, "unschedule")}>
                    Unschedule
                  </button>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "flex-end" }}>
                  <button style={ui.btn as any} disabled={busy} onClick={setScheduleFromSelected}>
                    Load existing
                  </button>
                </div>
              </div>

              <pre style={{
                marginTop: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 12,
                lineHeight: 1.5,
                color: "rgba(237,234,247,0.82)",
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 14,
                padding: 12,
                maxHeight: 520,
                overflow: "auto",
              }}>
                {selected.body}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}