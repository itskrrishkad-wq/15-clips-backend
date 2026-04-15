"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, LogOutIcon, Menu, Search } from "lucide-react";
import { useState } from "react";

interface TopNavbarProps {
  title: string;
  onMenuToggle?: () => void;
}

export function TopNavbar({ title, onMenuToggle }: TopNavbarProps) {
  const [loggingout, setLoggingout] = useState(false);

  const handleLogOut = async () => {
    setLoggingout(true);
    try {
      const res = await fetch("/api/admin-auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        console.log("Logout failed:", data.message);
        return;
      }

      // ✅ redirect after logout
      window.location.href = "/sign-in";
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setLoggingout(false);
    }
  };
  return (
    <header className="flex h-[60px] sm:h-[65px] items-center justify-between border-b border-border/40 bg-card/80 backdrop-blur-sm px-4 sm:px-7 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-xl shrink-0"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search anything..."
            className="h-10 w-48 md:w-72 rounded-xl border-border/50 bg-secondary/60 pl-10 text-[13px] placeholder:text-muted-foreground/50 focus:bg-card focus:shadow-soft transition-all duration-200"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-secondary"
        >
          <Bell className="h-[18px] w-[18px] text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full gradient-destructive ring-2 ring-card" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-max sm:h-10 sm:w-max rounded-xl hover:bg-secondary"
          onClick={handleLogOut}
          disabled={loggingout}
        >
          <LogOutIcon className="h-[18px] w-[18px] text-muted-foreground mr-1.5" />
          <span>{loggingout ? "Logging Out" : "Log out"}</span>
        </Button>
      </div>
    </header>
  );
}
