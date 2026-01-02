import { NextResponse } from "next/server";
import { z } from "zod";
import { getTicket, setTriage, TicketCategory, TicketPriority, TicketStatus } from "@/app/lib/supportKV";

const BodySchema = z.object({
  adminNotes: z.string().optional(),
});

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

export async function POST(req: Request, { params }: { params: { ticketId: string } }) {
  try {
    const ticketId = params.ticketId;

    const ticket = await getTicket(ticketId);
    if (!ticket) {
      return NextResponse.json({ ok: false, error: "Ticket not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const parsedBody = BodySchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Missing OPENAI_API_KEY env var" }, { status: 500 });
    }
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

ADMIN NOTES (optional):
${parsedBody.data.adminNotes?.trim() || "(none)"}

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
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    const text =
      (data?.output_text as string) ||
      data?.output?.[0]?.content?.[0]?.text ||
      "";

    const raw = (text || "").toString().trim();
    if (!raw) {
      return NextResponse.json({ ok: false, error: "Empty triage response" }, { status: 500 });
    }

    // Parse JSON safely
    let json: any = null;
    try {
      json = JSON.parse(raw);
    } catch {
      // Sometimes models wrap JSON in ```json ... ```
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      json = JSON.parse(cleaned);
    }

    const parsed = TriageSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Triage JSON did not match schema", details: parsed.error.flatten() },
        { status: 500 }
      );
    }

    const triage = {
      triagedAt: new Date().toISOString(),
      category: parsed.data.category as TicketCategory,
      priority: parsed.data.priority as TicketPriority,
      tags: (parsed.data.tags || []).map((t) => t.toLowerCase()).slice(0, 12),
      summary: parsed.data.summary,
      suggestedStatus: parsed.data.suggestedStatus as TicketStatus | undefined,
      suggestedNextSteps: parsed.data.suggestedNextSteps,
    };

    const updated = await setTriage(ticketId, triage);
    return NextResponse.json({ ok: true, ticket: updated, triage });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to triage" }, { status: 500 });
  }
}
