import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History as HistoryIcon, Trash2, Search } from "lucide-react";
import { useAuth } from "@/services/auth";
import { fetchUserSessions, refreshPerformance, type DbSession } from "@/services/interviews";
import { deleteRecord } from "@/services/db";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 10;

const History = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const rows = await fetchUserSessions(user.id);
      setSessions(rows);
    } catch (e) {
      toast({ title: "Could not load history", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Delete this interview session? This cannot be undone.")) return;
    try {
      await deleteRecord("interview_sessions", id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      await refreshPerformance(user.id);
      toast({ title: "Session deleted" });
    } catch (e) {
      toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const filtered = sessions.filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.role.toLowerCase().includes(q) ||
      s.interview_type.toLowerCase().includes(q) ||
      s.difficulty_level.toLowerCase().includes(q)
    );
  });
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview history</h1>
          <p className="text-muted-foreground">Every session, every score, every improvement.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search role, type..."
            className="pl-9"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          />
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center bg-gradient-card border-border/60">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-card border-border/60">
          <HistoryIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{sessions.length === 0 ? "No interviews yet." : "No matches."}</p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paged.map((s) => (
              <Card key={s.id} className="p-5 bg-gradient-card border-border/60 hover:shadow-card transition-smooth">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-lg">{s.role}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary">{s.interview_type}</Badge>
                      <Badge variant="outline">{s.difficulty_level}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(s.session_date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gradient">{Math.round(s.total_score ?? 0)}%</p>
                      <p className="text-xs text-muted-foreground">overall</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(s.id)}
                      aria-label="Delete session"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
