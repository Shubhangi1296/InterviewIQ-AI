import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessions } from "@/lib/interview";
import { History as HistoryIcon } from "lucide-react";

const History = () => {
  const sessions = getSessions();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview history</h1>
        <p className="text-muted-foreground">Every session, every score, every improvement.</p>
      </div>

      {sessions.length === 0 ? (
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
                    <Badge variant="secondary">{s.type}</Badge>
                    <Badge variant="outline">{s.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.date).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gradient">{s.score}%</p>
                  <p className="text-xs text-muted-foreground">overall</p>
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
