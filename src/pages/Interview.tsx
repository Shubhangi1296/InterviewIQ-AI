import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { generateQuestions, evaluateAnswer, saveSession, type InterviewSession } from "@/lib/interview";
import { toast } from "@/hooks/use-toast";

type Stage = "setup" | "interview" | "results";
type Feedback = ReturnType<typeof evaluateAnswer>;

const roles = ["Software Engineer", "Data Analyst", "Product Manager", "Designer", "Marketing Manager", "Consultant"];

const Interview = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("setup");
  const [role, setRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [type, setType] = useState<"Technical" | "Behavioral" | "HR">("Behavioral");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  const [questions, setQuestions] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const effectiveRole = customRole.trim() || role;

  const start = () => {
    const qs = generateQuestions(effectiveRole, type, difficulty);
    setQuestions(qs);
    setCurrent(0);
    setAnswers([]);
    setFeedbacks([]);
    setAnswer("");
    setStage("interview");
  };

  const submitAnswer = () => {
    if (answer.trim().length < 10) {
      toast({ title: "Answer too short", description: "Please write at least a few sentences.", variant: "destructive" });
      return;
    }
    const fb = evaluateAnswer(answer);
    const nextAnswers = [...answers, answer];
    const nextFeedbacks = [...feedbacks, fb];
    setAnswers(nextAnswers);
    setFeedbacks(nextFeedbacks);
    setAnswer("");

    if (current + 1 >= questions.length) {
      const avgScore = Math.round(nextFeedbacks.reduce((s, f) => s + f.score, 0) / nextFeedbacks.length);
      const session: InterviewSession = {
        id: crypto.randomUUID(),
        role: effectiveRole,
        type,
        difficulty,
        score: avgScore,
        strengths: [...new Set(nextFeedbacks.flatMap((f) => f.strengths))],
        weaknesses: [...new Set(nextFeedbacks.flatMap((f) => f.weaknesses))],
        date: new Date().toISOString(),
      };
      saveSession(session);
      setStage("results");
    } else {
      setCurrent(current + 1);
    }
  };

  if (stage === "setup") {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <Badge className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> New Interview</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Let's set up your mock interview</h1>
          <p className="text-muted-foreground">Tailor the experience to your target role.</p>
        </div>

        <Card className="p-6 md:p-8 bg-gradient-card border-border/60 space-y-6">
          <div className="space-y-2">
            <Label>Job role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type a custom role..."
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label>Interview type</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["Technical", "Behavioral", "HR"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-4 rounded-xl border text-sm font-medium transition-smooth ${
                    type === t
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`p-4 rounded-xl border text-sm font-medium transition-smooth ${
                    difficulty === d
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                >{d}</button>
              ))}
            </div>
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={start}>
            Start interview <ArrowRight className="h-5 w-5" />
          </Button>
        </Card>
      </div>
    );
  }

  if (stage === "interview") {
    const progress = ((current) / questions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">{type} • {difficulty} • {effectiveRole}</Badge>
          <span className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</span>
        </div>
        <Progress value={progress} className="mb-6" />

        <Card className="p-6 md:p-8 bg-gradient-card border-border/60">
          <div className="flex items-start gap-3 mb-6">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Interviewer</p>
              <p className="text-lg font-medium leading-relaxed">{questions[current]}</p>
            </div>
          </div>

          <Label htmlFor="answer" className="mb-2 block">Your answer</Label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Take your time. Structure with STAR and include concrete outcomes..."
            className="min-h-[200px] resize-none"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
            <Button variant="hero" onClick={submitAnswer}>
              {current + 1 === questions.length ? "Finish" : "Next question"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // results
  const avg = Math.round(feedbacks.reduce((s, f) => s + f.score, 0) / feedbacks.length);
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
      <Card className="p-8 bg-gradient-primary border-0 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative text-primary-foreground">
          <p className="text-sm opacity-90 mb-1">Interview complete</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Overall score: {avg}%</h1>
          <p className="opacity-90">{effectiveRole} • {type} • {difficulty}</p>
        </div>
      </Card>

      {questions.map((q, i) => (
        <Card key={i} className="p-6 bg-gradient-card border-border/60">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Question {i + 1}</p>
            <Badge variant="secondary" className="font-semibold">{feedbacks[i].score}%</Badge>
          </div>
          <p className="text-muted-foreground mb-4">{q}</p>
          <p className="text-sm mb-4 italic border-l-2 border-primary/50 pl-3">"{answers[i]}"</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" /> Strengths
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {feedbacks[i].strengths.map((s, j) => <li key={j}>• {s}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2 text-warning">
                <AlertCircle className="h-4 w-4" /> Improve
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {feedbacks[i].weaknesses.map((s, j) => <li key={j}>• {s}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm">{feedbacks[i].suggestion}</p>
          </div>
        </Card>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={() => setStage("setup")}>Practice again</Button>
        <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
      </div>
    </div>
  );
};

export default Interview;
