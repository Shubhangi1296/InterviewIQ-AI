import {
  Code2, Globe, BarChart3, Brain, ShieldCheck,
  Cog, Factory, Wrench,
  HardHat, Building2, Ruler,
  Megaphone, LineChart, Users, Briefcase,
  Palette, PenTool, Package,
  type LucideIcon,
} from "lucide-react";

export type Role = {
  name: string;
  icon: LucideIcon;
  /** Optional custom keywords to shape AI questions */
  focus?: string[];
};

export type Department = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  roles: Role[];
};

export const departments: Department[] = [
  {
    id: "cs-it",
    name: "Computer Science / IT",
    description: "Software, data, and security roles",
    icon: Code2,
    gradient: "from-[hsl(217,91%,60%)] to-[hsl(260,80%,60%)]",
    roles: [
      { name: "Software Engineer", icon: Code2, focus: ["data structures", "system design", "algorithms"] },
      { name: "Web Developer", icon: Globe, focus: ["HTML/CSS/JS", "React", "APIs", "performance"] },
      { name: "Data Analyst", icon: BarChart3, focus: ["SQL", "Excel", "visualization", "statistics"] },
      { name: "Data Scientist", icon: Brain, focus: ["ML models", "Python", "feature engineering", "A/B testing"] },
      { name: "Cybersecurity Analyst", icon: ShieldCheck, focus: ["threat detection", "OWASP", "incident response"] },
    ],
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    description: "Design, production, and maintenance",
    icon: Cog,
    gradient: "from-[hsl(25,95%,55%)] to-[hsl(0,80%,55%)]",
    roles: [
      { name: "Design Engineer", icon: Ruler, focus: ["CAD", "GD&T", "material selection"] },
      { name: "Production Engineer", icon: Factory, focus: ["lean manufacturing", "process optimization"] },
      { name: "Maintenance Engineer", icon: Wrench, focus: ["preventive maintenance", "root cause analysis"] },
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering",
    description: "Site, structures, and construction",
    icon: HardHat,
    gradient: "from-[hsl(38,92%,50%)] to-[hsl(24,85%,50%)]",
    roles: [
      { name: "Site Engineer", icon: HardHat, focus: ["site supervision", "safety", "scheduling"] },
      { name: "Structural Engineer", icon: Building2, focus: ["load analysis", "RCC design", "codes & standards"] },
      { name: "Construction Project Engineer", icon: Ruler, focus: ["project planning", "cost control", "contracts"] },
    ],
  },
  {
    id: "commerce",
    name: "Commerce / Management",
    description: "Marketing, finance, HR, and business",
    icon: Briefcase,
    gradient: "from-[hsl(142,71%,45%)] to-[hsl(160,70%,45%)]",
    roles: [
      { name: "Marketing Executive", icon: Megaphone, focus: ["campaigns", "branding", "market research"] },
      { name: "Financial Analyst", icon: LineChart, focus: ["financial modeling", "valuation", "Excel"] },
      { name: "Human Resources (HR) Specialist", icon: Users, focus: ["talent acquisition", "employee engagement", "policy"] },
      { name: "Business Development Associate", icon: Briefcase, focus: ["lead generation", "sales strategy", "client relationships"] },
    ],
  },
  {
    id: "design",
    name: "Design / Creative",
    description: "Product, UI/UX, and visual design",
    icon: Palette,
    gradient: "from-[hsl(300,80%,60%)] to-[hsl(260,80%,60%)]",
    roles: [
      { name: "UI/UX Designer", icon: Palette, focus: ["user research", "wireframing", "Figma", "accessibility"] },
      { name: "Graphic Designer", icon: PenTool, focus: ["typography", "branding", "Adobe Suite"] },
      { name: "Product Designer", icon: Package, focus: ["design systems", "prototyping", "user flows"] },
    ],
  },
];

export const findRole = (roleName: string) => {
  for (const d of departments) {
    const r = d.roles.find((x) => x.name === roleName);
    if (r) return { department: d, role: r };
  }
  return null;
};
