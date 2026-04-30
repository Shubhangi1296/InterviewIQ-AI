import { supabase } from "@/integrations/supabase/client";

/**
 * Generic, reusable data access layer for Supabase tables.
 * RLS policies on the database ensure users can only touch their own rows.
 *
 * Allowed table names are typed so we get autocomplete + type-safety from
 * the generated Supabase types. Add new tables here as the schema grows.
 */
export type TableName =
  | "profiles"
  | "interview_sessions"
  | "questions"
  | "responses"
  | "performance_tracking";

export type ListOptions = {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
};

const log = (op: string, table: string, extra?: unknown) => {
  // Lightweight logger — easy to grep, easy to silence later.
  // eslint-disable-next-line no-console
  console.debug(`[db] ${op} ${table}`, extra ?? "");
};

export async function getAll<T = unknown>(
  table: TableName,
  opts: ListOptions = {},
): Promise<T[]> {
  log("getAll", table, opts);
  // Cast to any to keep this generic helper tractable for TS across all tables.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase.from(table).select("*");
  if (opts.filters) {
    for (const [k, v] of Object.entries(opts.filters)) {
      q = q.eq(k, v);
    }
  }
  if (opts.orderBy) {
    q = q.order(opts.orderBy.column, { ascending: opts.orderBy.ascending ?? false });
  }
  if (opts.limit !== undefined) {
    const from = opts.offset ?? 0;
    q = q.range(from, from + opts.limit - 1);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function getById<T = unknown>(table: TableName, id: string): Promise<T | null> {
  log("getById", table, { id });
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as T | null;
}

export async function createRecord<T = unknown>(
  table: TableName,
  payload: Record<string, unknown>,
): Promise<T> {
  log("create", table);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = supabase.from(table);
  const { data, error } = await client.insert(payload).select().single();
  if (error) throw error;
  return data as T;
}

export async function updateRecord<T = unknown>(
  table: TableName,
  id: string,
  patch: Record<string, unknown>,
): Promise<T> {
  log("update", table, { id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = supabase.from(table);
  const { data, error } = await client.update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as T;
}

export async function deleteRecord(table: TableName, id: string): Promise<void> {
  log("delete", table, { id });
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
