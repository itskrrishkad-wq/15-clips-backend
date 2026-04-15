import { Badge } from "@/components/ui/badge";
import { reminders } from "@/lib/mock-data";

export function RemindersSection() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Reminders</h3>
        <span className="cursor-pointer text-[11px] font-medium text-primary hover:underline">Manage</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {reminders.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 transition-colors hover:bg-secondary">
            <span className="text-[13px] font-bold tabular-nums text-foreground">{r.time}</span>
            <Badge
              variant={r.priority === "high" ? "destructive" : "secondary"}
              className="rounded-md text-[9px] uppercase tracking-wider px-1.5"
            >
              {r.priority}
            </Badge>
            <span className="text-[11px] text-muted-foreground font-medium">{r.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
