import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, TrendingUp, Target, Flame, ArrowRight, Briefcase } from "lucide-react";
import { findRole } from "@/lib/roles";
import { getSessions } from "@/lib/interview";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const DashboardHome = () => {
  const sessions = getSessions();

  const stats = useMemo(() => {
    if (!sessions.length) return { avg: 0, count: 0, strength: "—", weakness: "—" };
    const avg = Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length);
    const freq = (arr: string[]) => {
      const m: Record<string, number> = {};
      arr.forEach((a) => (m[a] = (m[a] ?? 0) + 1));
      return Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    };
    return {
      avg,
      count: sessions.length,
      strength: freq(sessions.flatMap((s) => s.strengths)),
      weakness: freq(sessions.flatMap((s) => s.weaknesses)),
    };
  }, [sessions]);

  const chartData = useMemo(() => {
    const last = [...sessions].reverse().slice(-10);
    return last.map((s, i) => ({ name: `#${i + 1}`, score: s.score }));
  }, [sessions]);

  const byRole = useMemo(() => {
    const map: Record<string, { role: string; count: number; total: number; best: number }> = {};
    sessions.forEach((s) => {
      const k = s.role;
      if (!map[k]) map[k] = { role: k, count: 0, total: 0, best: 0 };
      map[k].count += 1;
      map[k].total += s.score;
      map[k].best = Math.max(map[k].best, s.score);
    });
    return Object.values(map)
      .map((r) => ({ ...r, avg: Math.round(r.total / r.count) }))
      .sort((a, b) => b.count - a.count);
  }, [sessions]);

  const statCards = [
    { label: "Average Score", value: `${stats.avg}%`, icon: Trophy, color: "from-primary to-primary-glow" },
    { label: "Interviews", value: stats.count, icon: Flame, color: "from-[hsl(38,92%,55%)] to-[hsl(25,95%,60%)]" },
    { label: "Top Strength", value: stats.strength, icon: TrendingUp, color: "from-[hsl(142,71%,45%)] to-[hsl(160,70%,50%)]" },
    { label: "Focus Area", value: stats.weakness, icon: Target, color: "from-[hsl(260,80%,60%)] to-[hsl(280,75%,65%)]" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* CTA hero */}
      <Card className="relative overflow-hidden p-8 bg-gradient-primary border-0 shadow-elegant">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 border-0 mb-3">
              <Sparkles className="h-3 w-3 mr-1" /> AI-powered
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Ready for your next round?</h1>
            <p className="text-primary-foreground/90 max-w-lg">Pick a role, choose your difficulty, and let AI run a realistic mock interview in minutes.</p>
          </div>
          <Button size="xl" variant="secondary" asChild>
            <Link to="/dashboard/interview">Start Interview <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="p-5 bg-gradient-card border-border/60 hover:shadow-card transition-smooth">
            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-glow`}>
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1 truncate">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Chart + recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-gradient-card border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Progress trend</h3>
              <p className="text-sm text-muted-foreground">Score evolution over recent sessions</p>
            </div>
          </div>
          <div className="h-64">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="score" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#score)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Complete your first interview to see progress here.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/60">
          <h3 className="text-lg font-semibold mb-4">Recent interviews</h3>
          {sessions.length ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.role}</p>
                    <p className="text-xs text-muted-foreground">{s.type} • {s.difficulty}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 font-semibold">{s.score}%</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No interviews yet. Start your first one!</p>
          )}
        </Card>
      </div>

      {/* Per-role performance */}
      {byRole.length > 0 && (
        <Card className="p-6 bg-gradient-card border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Performance by role</h3>
              <p className="text-sm text-muted-foreground">Tracked separately for each job role you practice</p>
            </div>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {byRole.map((r) => {
              const meta = findRole(r.role);
              const Icon = meta?.role.icon ?? Briefcase;
              const gradient = meta?.department.gradient ?? "from-primary to-primary-glow";
              return (
                <div key={r.role} className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/40 transition-smooth">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-glow shrink-0`}>
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.role}</p>
                      {meta && <p className="text-xs text-muted-foreground truncate">{meta.department.name}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg</p>
                      <p className="text-lg font-bold">{r.avg}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Best</p>
                      <p className="text-lg font-bold">{r.best}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Runs</p>
                      <p className="text-lg font-bold">{r.count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
