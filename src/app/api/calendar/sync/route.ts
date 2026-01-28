import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

const eventSchema = z.object({
  title: z.string(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  meta: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = z.object({ events: z.array(eventSchema).optional() }).safeParse(body);

  let events = parsed.success && parsed.data.events ? parsed.data.events : [];
  if (events.length === 0) {
    const today = new Date();
    const isoToday = today.toISOString().split("T")[0];
    const tomorrow = new Date(today.getTime() + 86400000).toISOString().split("T")[0];
    events = [
      {
        title: "eventos 100 pax",
        start_at: `${isoToday}T10:00:00.000Z`,
        end_at: `${isoToday}T18:00:00.000Z`,
        meta: { seed: true },
      },
      {
        title: "DESCANSO",
        start_at: `${tomorrow}T09:00:00.000Z`,
        end_at: `${tomorrow}T23:00:00.000Z`,
      },
      {
        title: "Bloque trabajo",
        start_at: `${isoToday}T08:00:00.000Z`,
        end_at: `${isoToday}T12:00:00.000Z`,
      },
    ];
  }

  const rows = events.map((ev) => {
    const lower = ev.title.toLowerCase();
    return {
      user_id: user.id,
      title: ev.title,
      start_at: ev.start_at,
      end_at: ev.end_at,
      meta: ev.meta ?? {},
      is_evento: lower.includes("eventos"),
      is_descanso: lower.includes("descanso"),
    };
  });

  const { data, error } = await supabase.from("calendar_events").insert(rows).select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ inserted: data });
}
