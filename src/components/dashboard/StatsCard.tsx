import { Film, Eye, Heart, Users, Megaphone, TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = { Film, Eye, Heart, Users, Megaphone };
const gradientMap: Record<string, string> = {
  Film: "gradient-primary",
  Eye: "gradient-info",
  Heart: "gradient-destructive",
  Users: "gradient-success",
  Megaphone: "gradient-warning",
};

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  const Icon = iconMap[icon] || Film;
  const gradient = gradientMap[icon] || "gradient-primary";
  
  return (
    <div className="group rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shadow-soft", gradient)}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className={cn(
          "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold",
          trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-[12px] text-muted-foreground">{title}</p>
    </div>
  );
}
