import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<{ name: string; email: string }>({ name: "", email: "" });

  useEffect(() => {
    const raw = localStorage.getItem("iq_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const save = () => {
    localStorage.setItem("iq_user", JSON.stringify(user));
    toast({ title: "Profile saved" });
  };

  const signOut = () => {
    localStorage.removeItem("iq_user");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <Card className="p-6 bg-gradient-card border-border/60 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        </div>
        <Button variant="hero" onClick={save}>Save changes</Button>
      </Card>

      <Card className="p-6 bg-gradient-card border-border/60">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card border-border/60">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <Button variant="destructive" onClick={signOut}>Sign out</Button>
      </Card>
    </div>
  );
};

export default Settings;
