import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { listMySessions, type DBSession } from "@/services/interviews";
import { deleteRecord } from "@/services/db";
import { toast } from "@/hooks/use-toast";

const History = () => {
  const [sessions, setSessions] = useState<DBSession[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    listMySessions()
      .then(setSessions)
      .catch((e) => toast({ title: "Failed to load history", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview session? This cannot be undone.")) return;
    try {
      await deleteRecord("interview_sessions", id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Session deleted" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast({ title: "Delete failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview history</h1>
        <p className="text-muted-foreground">Every session, every score, every improvement.</p>
      </div>

      {loading ? (
        <Card className="p-12 text-center bg-gradient-card border-border/60">
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      ) : sessions.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-card border-border/60">
          <HistoryIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No interviews yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
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
                    <p className="text-3xl font-bold text-gradient">
                      {s.total_score != null ? `${Math.round(Number(s.total_score))}%` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">overall</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
