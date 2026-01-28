"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { d8 } from "@/lib/ui/d8InlineUi";
import type { D8Storyboard, D8VideoShot } from "@/lib/video/d8VideoTypes";

type RecState = "idle" | "ready" | "recording" | "done" | "error";

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export default function VideoStudioClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const rafRef = useRef<number | null>(null);

  const [topic, setTopic] = useState("How Dominat8 Works");
  const [seconds, setSeconds] = useState(35);
  const [status, setStatus] = useState<RecState>("idle");
  const [err, setErr] = useState<string | null>(null);

  const [storyboard, setStoryboard] = useState<D8Storyboard | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const shots: D8VideoShot[] = useMemo(() => storyboard?.shots || [], [storyboard]);

  async function generateStoryboard() {
    setErr(null);
    setStatus("idle");
    setDownloadUrl(null);
    setStoryboard(null);
    setActiveIndex(0);

    const r = await fetch("/api/video/storyboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, seconds }),
    });

    const j = await r.json().catch(() => ({}));
    if (!j?.ok || !j?.storyboard) {
      setErr("Storyboard API failed.");
      setStatus("error");
      return;
    }
    setStoryboard(j.storyboard);
    setStatus("ready");
  }

  function stopAnimation() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number, shot: D8VideoShot, t: number) {
    // t: 0..1 progress through shot
    // Background
    ctx.clearRect(0, 0, w, h);

    // Rich-but-stable gradient (inline)
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(14, 10, 22, 1)");
    g.addColorStop(0.5, "rgba(10, 8, 16, 1)");
    g.addColorStop(1, "rgba(6, 5, 10, 1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Glow blobs
    const glow1 = ctx.createRadialGradient(w*0.22, h*0.2, 10, w*0.22, h*0.2, w*0.6);
    glow1.addColorStop(0, "rgba(125,90,255,0.22)");
    glow1.addColorStop(1, "rgba(125,90,255,0)");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, w, h);

    const glow2 = ctx.createRadialGradient(w*0.78, h*0.28, 10, w*0.78, h*0.28, w*0.55);
    glow2.addColorStop(0, "rgba(255,200,90,0.16)");
    glow2.addColorStop(1, "rgba(255,200,90,0)");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, w, h);

    // Card
    const pad = Math.round(w * 0.08);
    const cardX = pad;
    const cardY = Math.round(h * 0.18);
    const cardW = w - pad*2;
    const cardH = Math.round(h * 0.56);

    // Subtle zoom/pulse
    const pulse = 1 + 0.01 * Math.sin(t * Math.PI * 2);
    const cx = w/2, cy = h/2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);
    ctx.translate(-cx, -cy);

    // Rounded rect card
    const r = 18;
    ctx.beginPath();
    ctx.moveTo(cardX + r, cardY);
    ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, r);
    ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, r);
    ctx.arcTo(cardX, cardY + cardH, cardX, cardY, r);
    ctx.arcTo(cardX, cardY, cardX + cardW, cardY, r);
    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Title
    ctx.fillStyle = "rgba(246,242,255,0.95)";
    ctx.font = "900 34px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.textBaseline = "top";

    const titleY = cardY + 28;
    ctx.fillText("Dominat8", cardX + 28, titleY);

    // Shot title
    ctx.fillStyle = "rgba(237,234,247,0.75)";
    ctx.font = "800 18px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(shot.title, cardX + 28, titleY + 46);

    // Lines (animate in)
    const baseY = titleY + 92;
    const lines = shot.lines || [];
    for (let i = 0; i < lines.length; i++) {
      const p = Math.max(0, Math.min(1, (t * 1.2) - i * 0.22));
      const y = baseY + i * 40 + (1 - p) * 12;
      ctx.globalAlpha = 0.15 + 0.85 * p;
      ctx.fillStyle = "rgba(246,242,255,0.92)";
      ctx.font = "950 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
      ctx.fillText(lines[i], cardX + 28, y);
    }
    ctx.globalAlpha = 1;

    // Progress bar
    const barW = cardW - 56;
    const barX = cardX + 28;
    const barY = cardY + cardH - 34;
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(barX, barY, barW, 6);
    ctx.fillStyle = "rgba(255,215,140,0.50)";
    ctx.fillRect(barX, barY, barW * t, 6);

    ctx.restore();

    // Footer
    ctx.fillStyle = "rgba(237,234,247,0.55)";
    ctx.font = "700 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText("AI Auto Video Studio (D8)", pad, h - 28);
  }

  function playStoryboard(previewOnly: boolean) {
    setErr(null);
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    stopAnimation();

    const w = canvas.width;
    const h = canvas.height;

    if (!shots.length) {
      setErr("No shots loaded. Generate a storyboard first.");
      setStatus("error");
      return;
    }

    // Timeline
    const durations = shots.map(s => Math.max(2, Math.min(12, Math.floor(s.durationSec || 6))));
    const total = durations.reduce((a, b) => a + b, 0);
    let t0 = performance.now();

    function tick() {
      const elapsed = (performance.now() - t0) / 1000;
      let acc = 0;
      let idx = 0;
      while (idx < durations.length && acc + durations[idx] < elapsed) {
        acc += durations[idx];
        idx++;
      }
      if (idx >= durations.length) {
        // done
        setActiveIndex(durations.length - 1);
        drawFrame(ctx, w, h, shots[durations.length - 1], 1);
        stopAnimation();
        if (previewOnly) setStatus("ready");
        return;
      }
      setActiveIndex(idx);
      const local = elapsed - acc;
      const p = Math.max(0, Math.min(1, local / durations[idx]));
      drawFrame(ctx, w, h, shots[idx], p);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  async function startRecording() {
    setErr(null);
    setDownloadUrl(null);

    if (!canvasRef.current) return;
    if (!shots.length) {
      setErr("No shots loaded. Generate a storyboard first.");
      setStatus("error");
      return;
    }

    const canvas = canvasRef.current;

    // Capture canvas stream (no audio by default)
    const stream = canvas.captureStream(30);
    streamRef.current = stream;

    let options: MediaRecorderOptions = {};
    // Try common mime types (browser dependent)
    const prefers = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    for (const m of prefers) {
      if ((window as any).MediaRecorder && (MediaRecorder as any).isTypeSupported?.(m)) {
        options.mimeType = m;
        break;
      }
    }

    chunksRef.current = [];
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, options);
    } catch (e: any) {
      setErr("MediaRecorder failed to initialize. Try Chrome/Edge.");
      setStatus("error");
      return;
    }

    recRef.current = recorder;

    recorder.ondataavailable = (ev: BlobEvent) => {
      if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("done");
      // stop tracks
      stream.getTracks().forEach(t => t.stop());
    };

    setStatus("recording");
    recorder.start(250);

    // Start animation playback aligned with recording
    playStoryboard(false);

    // Stop recording after timeline ends (+ small buffer)
    const totalSec = shots.reduce((a, s) => a + Math.max(2, Math.min(12, Math.floor(s.durationSec || 6))), 0);
    window.setTimeout(() => {
      try { recorder.stop(); } catch {}
    }, Math.ceil((totalSec + 0.35) * 1000));
  }

  function stopRecording() {
    try { recRef.current?.stop(); } catch {}
  }

  useEffect(() => {
    // Setup fixed canvas size for consistent capture
    const c = canvasRef.current;
    if (!c) return;
    c.width = 1280;
    c.height = 720;

    // draw idle frame
    const ctx = c.getContext("2d");
    if (!ctx) return;
    drawFrame(ctx, c.width, c.height, { id: "idle", title: "Ready", durationSec: 6, lines: ["Generate a storyboard.", "Preview.", "Record."] }, 0.2);

    return () => {
      stopAnimation();
      try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    };
  }, []);

  const activeShot = shots[activeIndex];

  return (
    <div style={d8.page}>
      <div style={d8.shell}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px" }}>
            <h1 style={d8.h1}>AI Auto Video Studio</h1>
            <p style={d8.p}>
              Generate a short “How it works” explainer for Dominat8, preview it, then record it as a downloadable video.
              (This is a new page only: <b>/video</b>. Existing pages are unchanged.)
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flex: "0 0 auto" }}>
            <button
              onClick={generateStoryboard}
              style={d8.btnHot}
              title="Create a storyboard (uses OPENAI_API_KEY if present, fallback if not)"
            >
              Generate Storyboard
            </button>

            <button
              onClick={() => playStoryboard(true)}
              style={d8.btn}
              disabled={status === "recording" || !shots.length}
              title="Preview the storyboard animation"
            >
              Preview
            </button>

            {status !== "recording" ? (
              <button
                onClick={startRecording}
                style={d8.btn}
                disabled={!shots.length}
                title="Record the canvas as a video"
              >
                Record
              </button>
            ) : (
              <button onClick={stopRecording} style={d8.btn} title="Stop recording early">
                Stop
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12, marginTop: 12 }}>
          <div style={d8.card}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 320px" }}>
                <label style={{ fontSize: 12, color: "rgba(237,234,247,0.60)", fontWeight: 800 }}>Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={d8.input}
                  placeholder="How Dominat8 Works"
                />
              </div>
              <div style={{ width: 160 }}>
                <label style={{ fontSize: 12, color: "rgba(237,234,247,0.60)", fontWeight: 800 }}>Seconds</label>
                <input
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value || 35))}
                  style={d8.input}
                  type="number"
                  min={15}
                  max={90}
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.30)",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
              <div style={{ fontSize: 12, color: "rgba(237,234,247,0.62)", fontWeight: 800 }}>
                Status: <span style={{ color: "rgba(246,242,255,0.92)" }}>{status}</span>
              </div>
              {storyboard?.mode && (
                <div style={{ fontSize: 12, color: "rgba(237,234,247,0.62)", fontWeight: 800 }}>
                  Mode: <span style={{ color: "rgba(246,242,255,0.92)" }}>{storyboard.mode}</span>
                </div>
              )}
              {err && <div style={{ fontSize: 12, color: "rgba(255,140,140,0.92)", fontWeight: 900 }}>{err}</div>}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`dominat8_video_${nowStamp()}.webm`}
                  style={{
                    ...d8.btnHot,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Download Video (.webm)
                </a>
              )}
            </div>
          </div>

          <div style={d8.card}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontWeight: 950, fontSize: 14 }}>Storyboard</div>
              {storyboard?.createdAtIso && (
                <div style={{ fontSize: 11, color: "rgba(237,234,247,0.55)", fontWeight: 800 }}>
                  {new Date(storyboard.createdAtIso).toLocaleString()}
                </div>
              )}
            </div>

            {!storyboard && (
              <p style={d8.p}>
                Click <b>Generate Storyboard</b>. If you have <b>OPENAI_API_KEY</b> set on Vercel, it uses AI.
                Otherwise it uses a safe fallback storyboard.
              </p>
            )}

            {storyboard && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 950, marginBottom: 6 }}>{storyboard.title}</div>

                <div style={{ fontSize: 12, color: "rgba(237,234,247,0.70)", fontWeight: 800, marginBottom: 6 }}>
                  Active shot: <span style={{ color: "rgba(246,242,255,0.92)" }}>{activeShot?.title || "—"}</span>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {shots.map((s, i) => (
                    <div
                      key={s.id}
                      style={{
                        borderRadius: 14,
                        border: i === activeIndex ? "1px solid rgba(255,215,140,0.35)" : "1px solid rgba(255,255,255,0.10)",
                        background: i === activeIndex ? "rgba(255,215,140,0.06)" : "rgba(0,0,0,0.18)",
                        padding: 10,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontWeight: 950, fontSize: 12 }}>{i + 1}. {s.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(237,234,247,0.58)", fontWeight: 900 }}>
                          {Math.max(2, Math.min(12, Math.floor(s.durationSec || 6)))}s
                        </div>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(237,234,247,0.72)", lineHeight: 1.5 }}>
                        {(s.lines || []).map((ln, k) => <div key={k}>• {ln}</div>)}
                      </div>
                    </div>
                  ))}
                </div>

                {Array.isArray(storyboard.voiceover) && storyboard.voiceover.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 950, fontSize: 12, marginBottom: 6 }}>Voiceover (optional)</div>
                    <div style={{ fontSize: 12, color: "rgba(237,234,247,0.72)", lineHeight: 1.6 }}>
                      {storyboard.voiceover.map((v, i) => <div key={i}>— {v}</div>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "rgba(237,234,247,0.58)", fontWeight: 800 }}>
          Tip: If you want AI storyboards, set <b>OPENAI_API_KEY</b> on Vercel (server-side). This page never exposes keys.
        </div>
      </div>
    </div>
  );
}