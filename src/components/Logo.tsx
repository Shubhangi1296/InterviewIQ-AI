import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-interviewiq.png";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 font-bold text-lg ${className}`}>
    <img
      src={logoImg}
      alt="InterviewIQ AI logo"
      className="h-9 w-9 rounded-xl object-contain"
    />
    <span className="tracking-tight">
      Interview<span className="text-gradient">IQ</span>
    </span>
  </Link>
);
