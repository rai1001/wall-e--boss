import { createSupabaseServerClient } from "./supabase/server";

export async function getServerSession() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getUserOrThrow() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("No authenticated user");
  }
  return session.user;
}
