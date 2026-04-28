export type InterviewSession = {
  id: string;
  role: string;
  type: "Technical" | "Behavioral" | "HR";
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  strengths: string[];
  weaknesses: string[];
  date: string;
};

const KEY = "iq_sessions";

export const getSessions = (): InterviewSession[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
};

export const saveSession = (s: InterviewSession) => {
  const all = getSessions();
  all.unshift(s);
  localStorage.setItem(KEY, JSON.stringify(all));
};

// Placeholder: generate questions for a role/type. Swap with AI call later.
export const generateQuestions = (role: string, type: string, difficulty: string): string[] => {
  const base: Record<string, string[]> = {
    Technical: [
      `Explain a challenging ${role} problem you've solved and the tradeoffs you considered.`,
      `Walk through how you would design a scalable system for a ${role} use case.`,
      `What data structures would you use to optimize a hot path in a ${role} product?`,
    ],
    Behavioral: [
      `Tell me about a time you disagreed with a teammate. How did you resolve it?`,
      `Describe a project where you had to learn something new quickly as a ${role}.`,
      `Tell me about a time you failed. What did you learn?`,
    ],
    HR: [
      `Why do you want to work as a ${role} at our company?`,
      `Where do you see yourself in 5 years?`,
      `What motivates you most in your work?`,
    ],
  };
  const list = base[type] ?? base.Behavioral;
  return difficulty === "Hard" ? list : list.slice(0, 3);
};

// Placeholder feedback generator.
export const evaluateAnswer = (answer: string) => {
  const len = answer.trim().split(/\s+/).filter(Boolean).length;
  const score = Math.max(40, Math.min(98, 50 + Math.round(len * 0.8) + Math.floor(Math.random() * 10)));
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (len > 60) strengths.push("Rich, detailed response");
  else weaknesses.push("Answer could be more detailed");
  if (/because|therefore|however|specifically/i.test(answer)) strengths.push("Good reasoning structure");
  else weaknesses.push("Add clearer reasoning connectors");
  if (/result|impact|outcome|%|\d+/i.test(answer)) strengths.push("Mentions measurable impact");
  else weaknesses.push("Include concrete outcomes or metrics");
  return {
    score,
    strengths: strengths.length ? strengths : ["Clear tone"],
    weaknesses: weaknesses.length ? weaknesses : ["Consider practicing STAR format"],
    suggestion:
      "Use the STAR framework (Situation, Task, Action, Result) and quantify impact wherever possible.",
  };
};
