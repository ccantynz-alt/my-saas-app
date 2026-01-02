import { NextResponse } from "next/server";
import { createTicket, listTickets } from "@/app/lib/supportKV";
import { autoTriage } from "@/app/lib/supportTriage";
import { randomUUID } from "crypto";

export async function GET() {
  const tickets = await listTickets();
  return NextResponse.json({ ok: true, tickets });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { subject, message, userId, projectId, email } = body;

  if (!subject || !message || !userId) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const triage = autoTriage(subject, message);

  const ticket = await createTicket({
    userId,
    projectId,
    email,
    subject,
    status: "open",
    tags: triage.tags,
    priority: triage.priority,
    messages: [
      {
        id: randomUUID(),
        author: "user",
        body: message,
        createdAt: new Date().toISOString(),
      },
    ],
  });

  return NextResponse.json({ ok: true, ticket });
}
