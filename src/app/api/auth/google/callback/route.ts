import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../../lib/env";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { getUserOrThrow } from "../../../../../lib/auth";

export async function GET(req: NextRequest) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!code) return NextResponse.json({ error: "missing code" }, { status: 400 });

  const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  };

  if (!tokenRes.ok || !tokenJson.access_token) {
    return NextResponse.json({ error: "Failed to exchange code", details: tokenJson }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const expiresAt = tokenJson.expires_in ? new Date(Date.now() + tokenJson.expires_in * 1000).toISOString() : null;

  await supabase.from("oauth_accounts").upsert({
    user_id: user.id,
    provider: "google",
    access_token: tokenJson.access_token,
    refresh_token: tokenJson.refresh_token ?? null,
    expires_at: expiresAt,
    scope: tokenJson.scope ?? "",
  });

  return NextResponse.redirect(new URL("/app/settings", req.nextUrl.origin));
}
