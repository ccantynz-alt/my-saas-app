import { NextResponse } from "next/server";
import { listTickets, setTriage } from "@/app/lib/supportKV";
import { z } from "zod";

const TriageSchema = z.object({
  category: z.enum([
    "domains_ssl",
    "billing",
    "account_access",
    "build_deploy",
    "bug",
    "feature_request",
    "how_to",
    "other",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  tags: z.array(z.string()).max(12),
  summary: z.string().min(1).max(500),
  suggestedStatus: z.enum(["open", "pending", "resolved", "closed"]).optional(),
  suggestedNextSteps: z.array(z.string()).max(10).optional(),
});

function safeJoinMessages(ticket: any) {
  const msgs = Array.isArray(ticket?.messages) ? ticket.messages : [];
  return msgs
    .map((m: any) => {
      const from = m?.from === "admin" ? "ADMIN" : "CUSTOMER";
      const at = m?.at ? ` (${m.at})` : "";
      const text = (m?.text || "").toString();
      return `${from}${at}: ${text}`;
    })
    .join("\n\n");
}

function triageInstructions() {
  return `
You are an expert support triage assistant for an AI website builder SaaS (Next.js/Vercel/KV).
Your task: produce a STRICT JSON object that matches the given schema. No prose.

Rules:
- tags must be short lowercase keywords, no spaces if possible (use hyphen), e.g. "dns", "cloudflare", "ssl", "cname", "a-record", "vercel", "404", "billing", "login".
- category must be the best match from the allowed list.
- priority:
  * urgent = site down for many users / security concern / billing lockout
  * high = production broken for one customer / domain/ssl blocking launch
  * medium = important but not blocking
  * low = general questions
- suggestedStatus:
  * resolved only if the customer confirms it's fixed or the request is obviously complete
  * pending if admin already replied and waiting on customer
  * open otherwise
- suggestedNextSteps: short action steps (max 10). If unknown, omit it.

Output ONLY JSON.
`.trim();
}

async function triageTicketWithOpenAI(ticket: any) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY env var");

  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  const context = `
TICKET:
- id: ${ticket.id}
- currentStatus: ${ticket.status}
- projectId: ${ticket.projectId || "(none)"}
- email: ${ticket.email || "(none)"}
- subject: ${ticket.subject}

CONVERSATION (latest last):
${safeJoinMessages(ticket)}

Now produce triage JSON.
`.trim();

  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: triageInstructions(),
      input: context,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    const msg = (data && (data.error?.message || data.message)) || `OpenAI error (HTTP ${resp.status})`;
    throw new Error(msg);
  }

  const text = (data?.output_text as string) || data?.output?.[0]?.content?.[0]?.text || "";
  const raw = (text || "").toString().trim();
  if (!raw) throw new Error("Empty triage response");

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    json = JSON.parse(cleaned);
  }

  const parsed = TriageSchema.safeParse(json);
  if (!parsed.success) throw new Error("Triage JSON did not match schema");

  return {
    triagedAt: new Date().toISOString(),
    category: parsed.data.category,
    priority: parsed.data.priority,
    tags: (parsed.data.tags || []).map((t) => t.toLowerCase()).slice(0, 12),
    summary: parsed.data.summary,
    suggestedStatus: parsed.data.suggestedStatus,
    suggestedNextSteps: parsed.data.suggestedNextSteps,
  };
}

export async function POST() {
  try {
    // Require key so the button gives a clear error
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing OPENAI_API_KEY env var" }, { status: 500 });
    }

    const tickets = await listTickets();

    let triaged = 0;
    let skipped = 0;
    let failed = 0;

    for (const t of tickets) {
      if (t.triage) {
        skipped++;
        continue;
      }

      try {
        const triage = await triageTicketWithOpenAI(t);
        await setTriage(t.id, triage as any);
        triaged++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({
      ok: true,
      triaged,
      skipped,
      failed,
      total: tickets.length,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to triage all" }, { status: 500 });
  }
}
