import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { getUserOrThrow } from "../../../../lib/auth";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  // add write if needed later: "https://www.googleapis.com/auth/calendar.events"
];

export async function GET(req: NextRequest) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }
  await getUserOrThrow(); // ensure logged in
  const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
