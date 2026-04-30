// Domain services for interview flows. Higher-level than the generic db layer.
import { supabase } from "@/integrations/supabase/client";
import { createRecord, getAll } from "./db";

export type DBSession = {
  id: string;
  user_id: string;
  role: string;
  field_category: string | null;
  interview_type: string;
  difficulty_level: string;
  total_score: number | null;
  session_date: string;
  created_at: string;
};

export type DBQuestion = {
  id: string;
  session_id: string;
  user_id: string;
  question_text: string;
  question_type: string | null;
  difficulty_level: string | null;
  order_index: number;
};

export type DBResponse = {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  user_answer: string | null;
  ai_score: number | null;
  feedback: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
};

const requireUserId = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return data.user.id;
};

export async function createInterviewSession(input: {
  role: string;
  field_category: string;
  interview_type: string;
  difficulty_level: string;
}): Promise<DBSession> {
  const user_id = await requireUserId();
  return createRecord<DBSession>("interview_sessions", { ...input, user_id });
}

export async function addQuestions(
  session_id: string,
  questions: { question_text: string; question_type: string; difficulty_level: string }[],
): Promise<DBQuestion[]> {
  const user_id = await requireUserId();
  const rows = questions.map((q, i) => ({ ...q, session_id, user_id, order_index: i }));
  const { data, error } = await supabase.from("questions").insert(rows).select();
  if (error) throw error;
  return (data as DBQuestion[]) ?? [];
}

export async function addResponse(input: {
  session_id: string;
  question_id: string;
  user_answer: string;
  ai_score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}): Promise<DBResponse> {
  const user_id = await requireUserId();
  return createRecord<DBResponse>("responses", { ...input, user_id });
}

export async function finalizeSession(session_id: string, total_score: number) {
  const { data, error } = await supabase
    .from("interview_sessions")
    .update({ total_score })
    .eq("id", session_id)
    .select()
    .single();
  if (error) throw error;
  return data as DBSession;
}

export async function listMySessions(): Promise<DBSession[]> {
  return getAll<DBSession>("interview_sessions", {
    orderBy: { column: "session_date", ascending: false },
  });
}

export type PerformanceRow = {
  id: string;
  user_id: string;
  average_score: number | null;
  total_sessions: number | null;
  strongest_area: string | null;
  weakest_area: string | null;
  progress_status: string | null;
  updated_at: string;
};

export async function getMyPerformance(): Promise<PerformanceRow | null> {
  const { data, error } = await supabase
    .from("performance_tracking")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as PerformanceRow) ?? null;
}

export async function refreshMyPerformance(): Promise<void> {
  const user_id = await requireUserId();
  const sessions = await listMySessions();
  const scored = sessions.filter((s) => s.total_score != null);
  const total_sessions = scored.length;
  const average_score = total_sessions
    ? Math.round(scored.reduce((s, x) => s + Number(x.total_score), 0) / total_sessions)
    : 0;

  // Strongest/weakest area = role with best/worst average
  const byRole: Record<string, { total: number; count: number }> = {};
  scored.forEach((s) => {
    const k = s.role;
    if (!byRole[k]) byRole[k] = { total: 0, count: 0 };
    byRole[k].total += Number(s.total_score);
    byRole[k].count += 1;
  });
  const ranked = Object.entries(byRole)
    .map(([role, v]) => ({ role, avg: v.total / v.count }))
    .sort((a, b) => b.avg - a.avg);
  const strongest_area = ranked[0]?.role ?? null;
  const weakest_area = ranked.length > 1 ? ranked[ranked.length - 1].role : null;
  const progress_status =
    total_sessions === 0 ? "just_started"
      : average_score >= 80 ? "advanced"
      : average_score >= 60 ? "improving"
      : "needs_practice";

  const { error } = await supabase
    .from("performance_tracking")
    .upsert(
      {
        user_id,
        average_score,
        total_sessions,
        strongest_area,
        weakest_area,
        progress_status,
      },
      { onConflict: "user_id" },
    );
  if (error) throw error;
}
