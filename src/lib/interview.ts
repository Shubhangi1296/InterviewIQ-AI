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
export const generateQuestions = (
  role: string,
  type: string,
  difficulty: string,
  focus: string[] = [],
): string[] => {
  const f1 = focus[0] ?? role.toLowerCase();
  const f2 = focus[1] ?? "your core skills";
  const f3 = focus[2] ?? "real-world scenarios";

  const base: Record<string, string[]> = {
    Technical: [
      `As a ${role}, explain a challenging problem involving ${f1} you've solved and the tradeoffs you considered.`,
      `Walk me through how you would approach a real ${role} task that requires ${f2}.`,
      `Describe how you'd apply ${f3} to improve outcomes in a ${role} project.`,
      `What tools, frameworks, or methods are essential for a ${role}, and why?`,
    ],
    Behavioral: [
      `Tell me about a time you disagreed with a teammate on a ${role} project. How did you resolve it?`,
      `Describe a situation where you had to learn ${f1} quickly as a ${role}.`,
      `Tell me about a time you failed in a ${role} context. What did you learn?`,
      `Share an example of delivering results under pressure as a ${role}.`,
    ],
    HR: [
      `Why do you want to work as a ${role} at our company?`,
      `Where do you see yourself in 5 years within the ${role} path?`,
      `What motivates you most in your work as a ${role}?`,
      `How do you handle feedback and continuous learning as a ${role}?`,
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
