import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Brain, Target, TrendingUp, Zap, MessageSquare, BarChart3,
  CheckCircle2, Sparkles, ArrowRight, Star
} from "lucide-react";
import heroImg from "@/assets/hero-ai.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-smooth">Features</a>
            <a href="#how" className="hover:text-foreground transition-smooth">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-smooth">Testimonials</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur px-4 py-1.5 text-sm mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">AI-Powered Interview Coach</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                Ace Your Next Interview with <span className="text-gradient">AI</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                Practice real interview scenarios, get instant feedback, and improve faster with InterviewIQ AI.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">Get Started Free <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="xl">Book Demo</Button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> No credit card</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Free plan forever</div>
              </div>
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="absolute -inset-8 bg-gradient-primary opacity-30 blur-3xl" />
              <img
                src={heroImg}
                alt="AI interview dashboard preview"
                width={1920}
                height={1080}
                className="relative rounded-2xl shadow-elegant border border-border/50 animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to land the offer</h2>
            <p className="text-lg text-muted-foreground">Real practice. Real feedback. Real progress.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Mock Interviews", desc: "Role-specific questions generated dynamically for technical, HR, and behavioral rounds." },
              { icon: MessageSquare, title: "Instant Feedback", desc: "Submit answers and receive NLP-powered scoring, strengths, and actionable improvements." },
              { icon: BarChart3, title: "Performance Dashboard", desc: "Track scores, trends, and focus areas across every interview you complete." },
              { icon: Target, title: "Role-Targeted Practice", desc: "From SWE to PM to Consulting — prep with the right questions every time." },
              { icon: Zap, title: "Adaptive Difficulty", desc: "Easy, medium, hard — match your preparation level and level up gradually." },
              { icon: TrendingUp, title: "Progress Insights", desc: "Visualize improvement over time with charts that highlight growth." },
            ].map((f, i) => (
              <Card key={i} className="p-6 bg-gradient-card border-border/60 hover:shadow-elegant hover:-translate-y-1 transition-smooth group">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-smooth">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to interview mastery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Choose your role", desc: "Pick the job, interview type, and difficulty that matches your goal." },
              { n: "02", title: "Practice with AI", desc: "Answer dynamically generated questions tailored to your target role." },
              { n: "03", title: "Improve faster", desc: "Get detailed feedback and track progress on your dashboard." },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-gradient mb-4">{s.n}</div>
                <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by candidates worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", role: "New Grad, SWE @ Google", quote: "I went from rambling in behavioral rounds to giving crisp STAR answers. Got my dream offer in 6 weeks." },
              { name: "Marcus L.", role: "Career Switcher → Data", quote: "The feedback is sharper than most human mentors I've worked with. Absolutely game-changing." },
              { name: "Ayesha K.", role: "CS Senior", quote: "Practiced 40+ mock interviews. My confidence and clarity are on another level now." },
            ].map((t, i) => (
              <Card key={i} className="p-6 bg-gradient-card border-border/60">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-foreground/90 mb-6">"{t.quote}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden p-12 md:p-20 text-center bg-gradient-primary border-0 shadow-elegant">
            <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Ready to master your next interview?</h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">Join thousands preparing smarter with AI.</p>
              <Button size="xl" variant="secondary" asChild>
                <Link to="/signup">Start practicing free <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">© 2026 InterviewIQ AI. Master every interview.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
