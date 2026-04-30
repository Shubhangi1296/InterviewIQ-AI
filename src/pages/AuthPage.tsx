import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/services/auth";

type Props = { mode: "login" | "signup" };

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const AuthPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      if (isSignup) {
        const parsed = signupSchema.safeParse({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          confirm: form.get("confirm"),
        });
        if (!parsed.success) {
          toast({ title: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.name);
        if (error) {
          toast({ title: "Sign up failed", description: error, variant: "destructive" });
          return;
        }
        toast({ title: "Account created", description: "Welcome to InterviewIQ AI!" });
        navigate("/dashboard");
      } else {
        const parsed = loginSchema.safeParse({
          email: form.get("email"),
          password: form.get("password"),
        });
        if (!parsed.success) {
          toast({ title: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await signIn(parsed.data.email, parsed.data.password);
        if (error) {
          toast({ title: "Sign in failed", description: error, variant: "destructive" });
          return;
        }
        toast({ title: "Welcome back" });
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <Logo className="relative text-primary-foreground" />
        <div className="relative animate-fade-in-up">
          <Sparkles className="h-10 w-10 mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4 leading-tight">Master every interview, one answer at a time.</h2>
          <p className="text-lg opacity-90 max-w-md">
            Personalized AI feedback, role-specific questions, and real progress tracking — all in one beautiful platform.
          </p>
        </div>
        <p className="relative text-sm opacity-75">© 2026 InterviewIQ AI</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-md p-8 border-border/60 shadow-card animate-fade-in-up">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="text-3xl font-bold mb-2">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isSignup ? "Start practicing smarter in seconds." : "Sign in to continue your prep."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required placeholder="Ada Lovelace" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" minLength={6} />
            </div>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" name="confirm" type="password" required placeholder="••••••••" />
              </div>
            )}
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignup ? "Already have an account? " : "New here? "}
            <Link to={isSignup ? "/login" : "/signup"} className="text-primary font-medium hover:underline">
              {isSignup ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
