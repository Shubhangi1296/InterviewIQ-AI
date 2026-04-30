import { supabase } from "@/integrations/supabase/client";
import { createRecord, getAll, updateRecord } from "./db";

export type DbSession = {
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

export type DbQuestion = {
  id: string;
  session_id: string;
  user_id: string;
  question_text: string;
  question_type: string | null;
  difficulty_level: string | null;
  order_index: number;
};

export type DbResponse = {
  id: string;
  question_id: string;
  session_id: string;
  user_id: string;
  user_answer: string | null;
  ai_score: number | null;
  feedback: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
};

export type DbPerformance = {
  id: string;
  user_id: string;
  average_score: number | null;
  total_sessions: number | null;
  strongest_area: string | null;
  weakest_area: string | null;
  progress_status: string | null;
};

export const fetchUserSessions = (userId: string) =>
  getAll<DbSession>("interview_sessions", {
    filters: { user_id: userId },
    orderBy: { column: "session_date", ascending: false },
  });

export const fetchUserPerformance = async (userId: string) => {
  const { data, error } = await supabase
    .from("performance_tracking")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as DbPerformance | null;
};

type CompleteSessionInput = {
  userId: string;
  role: string;
  fieldCategory: string | null;
  type: string;
  difficulty: string;
  questions: { text: string; type: string; difficulty: string }[];
  answers: string[];
  feedbacks: { score: number; feedback: string; strengths: string[]; weaknesses: string[] }[];
};

/**
 * Persist a finished interview: session header + each question + each response,
 * then refresh the user's aggregate performance row.
 */
export const persistCompletedInterview = async (input: CompleteSessionInput) => {
  const avg =
    input.feedbacks.length === 0
      ? 0
      : Math.round(input.feedbacks.reduce((s, f) => s + f.score, 0) / input.feedbacks.length);

  const session = await createRecord<DbSession>("interview_sessions", {
    user_id: input.userId,
    role: input.role,
    field_category: input.fieldCategory,
    interview_type: input.type,
    difficulty_level: input.difficulty,
    total_score: avg,
  });

  // Insert questions, then responses in one round-trip each.
  const questionRows = input.questions.map((q, i) => ({
    session_id: session.id,
    user_id: input.userId,
    question_text: q.text,
    question_type: q.type,
    difficulty_level: q.difficulty,
    order_index: i,
  }));

  const { data: insertedQs, error: qErr } = await supabase
    .from("questions")
    .insert(questionRows)
    .select();
  if (qErr) throw qErr;

  const responseRows = (insertedQs ?? []).map((q, i) => ({
    question_id: q.id,
    session_id: session.id,
    user_id: input.userId,
    user_answer: input.answers[i] ?? null,
    ai_score: input.feedbacks[i]?.score ?? null,
    feedback: input.feedbacks[i]?.feedback ?? null,
    strengths: input.feedbacks[i]?.strengths ?? [],
    weaknesses: input.feedbacks[i]?.weaknesses ?? [],
  }));

  const { error: rErr } = await supabase.from("responses").insert(responseRows);
  if (rErr) throw rErr;

  await refreshPerformance(input.userId);
  return session;
};

/** Recalculate aggregate performance from all of a user's sessions. */
export const refreshPerformance = async (userId: string) => {
  const sessions = await fetchUserSessions(userId);

  const total = sessions.length;
  const avg =
    total === 0
      ? 0
      : Math.round(
          sessions.reduce((s, x) => s + (x.total_score ?? 0), 0) / total,
        );

  // Pull all responses to compute strongest/weakest area.
  const { data: responses } = await supabase
    .from("responses")
    .select("strengths, weaknesses")
    .eq("user_id", userId);

  const tally = (key: "strengths" | "weaknesses") => {
    const map: Record<string, number> = {};
    (responses ?? []).forEach((r) => {
      (r[key] ?? []).forEach((v: string) => {
        map[v] = (map[v] ?? 0) + 1;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  };

  const status =
    total === 0 ? "just_started" : avg >= 80 ? "advanced" : avg >= 60 ? "improving" : "needs_practice";

  // Upsert by user_id (unique).
  const { data: existing } = await supabase
    .from("performance_tracking")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const patch = {
    average_score: avg,
    total_sessions: total,
    strongest_area: tally("strengths"),
    weakest_area: tally("weaknesses"),
    progress_status: status,
  };

  if (existing) {
    await updateRecord("performance_tracking", existing.id, patch);
  } else {
    await createRecord("performance_tracking", { user_id: userId, ...patch });
  }
};
