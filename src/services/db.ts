// Generic data access layer over Lovable Cloud (Supabase).
// All operations respect Row-Level Security — users only see/modify their own rows.
import { supabase } from "@/integrations/supabase/client";

type TableName =
  | "profiles"
  | "interview_sessions"
  | "questions"
  | "responses"
  | "performance_tracking";

export type ListOptions = {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  range?: { from: number; to: number }; // pagination, inclusive
  select?: string;
};

const log = (op: string, table: string, extra?: unknown) =>
  // eslint-disable-next-line no-console
  console.debug(`[db] ${op} ${table}`, extra ?? "");

export async function getAll<T = Record<string, unknown>>(
  table: TableName,
  opts: ListOptions = {},
): Promise<T[]> {
  log("getAll", table, opts);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = (supabase.from(table) as any).select(opts.select ?? "*");
  if (opts.filters) {
    for (const [k, v] of Object.entries(opts.filters)) {
      q = v === null ? q.is(k, null) : q.eq(k, v);
    }
  }
  if (opts.orderBy) {
    q = q.order(opts.orderBy.column, { ascending: opts.orderBy.ascending ?? false });
  }
  if (opts.range) q = q.range(opts.range.from, opts.range.to);
  const { data, error } = await q;
  if (error) throw error;
  return (data as T[]) ?? [];
}

export async function getById<T = Record<string, unknown>>(
  table: TableName,
  id: string,
  idColumn = "id",
): Promise<T | null> {
  log("getById", table, { id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from(table) as any).select("*").eq(idColumn, id).maybeSingle();
  if (error) throw error;
  return (data as T) ?? null;
}

export async function createRecord<T = Record<string, unknown>>(
  table: TableName,
  values: Record<string, unknown>,
): Promise<T> {
  log("create", table, values);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from(table) as any).insert(values).select().single();
  if (error) throw error;
  return data as T;
}

export async function updateRecord<T = Record<string, unknown>>(
  table: TableName,
  id: string,
  values: Record<string, unknown>,
  idColumn = "id",
): Promise<T> {
  log("update", table, { id, values });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from(table) as any)
    .update(values)
    .eq(idColumn, id)
    .select()
    .single();
  if (error) throw error;
  return data as T;
}

export async function deleteRecord(
  table: TableName,
  id: string,
  idColumn = "id",
): Promise<void> {
  log("delete", table, { id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from(table) as any).delete().eq(idColumn, id);
  if (error) throw error;
}
