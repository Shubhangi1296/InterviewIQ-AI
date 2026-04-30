import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Props = { mode: "login" | "signup" };

const AuthPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim();
    const password = form.get("password") as string;

    try {
      if (isSignup) {
        const name = ((form.get("name") as string) ?? "").trim();
        const confirm = form.get("confirm") as string;
        if (password !== confirm) {
          toast({ title: "Passwords don't match", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Welcome to InterviewIQ AI!" });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back" });
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: isSignup ? "Sign up failed" : "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Branding panel */}
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

      {/* Form panel */}
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
              <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
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
