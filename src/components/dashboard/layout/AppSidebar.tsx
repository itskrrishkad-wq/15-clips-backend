"use client";
import { cn } from "@/lib/utils";
import {
  Film,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Reels", href: "/dashboard/reels", icon: Film },
  { title: "Ads", href: "/dashboard/ads", icon: Megaphone },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Admins", href: "/dashboard/admins", icon: ShieldCheck },
];

const bottomNav = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface AppSidebarProps {
  onClose?: () => void;
}

export function AppSidebar({ onClose }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.endsWith(href);
  };

  return (
    <aside className="flex h-screen w-[250px] flex-col bg-card px-5 py-7 border-r border-border/50">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <span className="text-sm font-bold text-primary-foreground tracking-tight">
              15
            </span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            15 Clips
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-secondary text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex flex-1 flex-col gap-1.5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
          Menu
        </p>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
              isActive(item.href)
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110",
                isActive(item.href) ? "text-primary-foreground" : "",
              )}
            />
            <span>{item.title}</span>
          </Link>
        ))}

        <div className="flex-1" />

        <div className="flex flex-col gap-1.5 border-t border-border/50 pt-4">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                isActive(item.href)
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        {/* <div className="mt-4 rounded-2xl bg-secondary/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold text-primary-foreground">
              AH
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">
                Alex Holland
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Admin
              </p>
            </div>
          </div>
        </div> */}
      </nav>
    </aside>
  );
}
