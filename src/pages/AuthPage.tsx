import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Sparkles, Github, Chrome } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Props = { mode: "login" | "signup" };

const AuthPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string) ?? "Candidate";
    const email = form.get("email") as string;

    if (isSignup) {
      const password = form.get("password") as string;
      const confirm = form.get("confirm") as string;
      if (password !== confirm) {
        toast({ title: "Passwords don't match", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    // Placeholder: store user locally until Cloud auth is wired.
    localStorage.setItem("iq_user", JSON.stringify({ name: isSignup ? name : email.split("@")[0], email }));
    setTimeout(() => {
      toast({ title: isSignup ? "Account created" : "Welcome back" });
      navigate("/dashboard");
    }, 500);
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

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" type="button"><Chrome className="h-4 w-4" /> Google</Button>
            <Button variant="outline" type="button"><Github className="h-4 w-4" /> GitHub</Button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or with email</span>
            </div>
          </div>

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
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignup && (
                  <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
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
