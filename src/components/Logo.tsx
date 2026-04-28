import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 font-bold text-lg ${className}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60" />
      <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
        <Brain className="h-5 w-5 text-primary-foreground" />
      </div>
    </div>
    <span className="tracking-tight">
      Interview<span className="text-gradient">IQ</span>
    </span>
  </Link>
);
