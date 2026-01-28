import { NextResponse } from "next/server";
import { addDays, startOfDay } from "date-fns";
import { env } from "../../../../../lib/env";
import { createSupabaseServiceClient, createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { getUserOrThrow } from "../../../../../lib/auth";

async function refreshToken(refresh: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID ?? "",
      client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: refresh,
      grant_type: "refresh_token",
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) throw new Error("refresh failed");
  return json.access_token as string;
}

async function syncForUser(userId: string, accessToken: string, supabase: ReturnType<typeof createSupabaseServiceClient>) {
  const timeMin = startOfDay(new Date()).toISOString();
  const timeMax = addDays(new Date(), 2).toISOString();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const data = (await res.json()) as { items?: Array<{ summary?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string } }> };
  if (!res.ok || !data.items) throw new Error("google list failed");

  const rows = data.items.map((ev) => {
    const title: string = ev.summary ?? "Evento";
    const lower = title.toLowerCase();
    return {
      user_id: userId,
      title,
      start_at: ev.start?.dateTime ?? `${ev.start?.date}T00:00:00Z`,
      end_at: ev.end?.dateTime ?? `${ev.end?.date}T23:59:00Z`,
      is_evento: lower.includes("eventos"),
      is_descanso: lower.includes("descanso"),
      meta: ev,
    };
  });

  await supabase.from("calendar_events").insert(rows);
}

export async function POST(request: Request) {
  const isCron = request.headers.get("x-cron-secret") === env.CRON_SECRET || Boolean(request.headers.get("x-vercel-cron"));
  const supabase = isCron ? createSupabaseServiceClient() : createSupabaseServerClient();
  const user = isCron ? null : await getUserOrThrow().catch(() => null);

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  if (isCron) {
    const { data: accounts } = await supabase.from("oauth_accounts").select("*").eq("provider", "google");
    if (!accounts?.length) return NextResponse.json({ synced: 0 });
    let count = 0;
    for (const acc of accounts) {
      const token = acc.refresh_token ? await refreshToken(acc.refresh_token) : acc.access_token;
      await syncForUser(acc.user_id, token, supabase);
      count += 1;
    }
    return NextResponse.json({ synced: count, mode: "cron" });
  }

  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const { data: acc } = await supabase.from("oauth_accounts").select("*").eq("user_id", user.id).eq("provider", "google").maybeSingle();
  if (!acc) return NextResponse.json({ error: "connect Google first" }, { status: 400 });
  const token = acc.refresh_token ? await refreshToken(acc.refresh_token) : acc.access_token;
  await syncForUser(user.id, token, supabase);
  return NextResponse.json({ synced: 1, mode: "user" });
}
