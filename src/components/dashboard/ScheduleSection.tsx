import { scheduleItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ScheduleSection() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Schedule</h3>
        <span className="cursor-pointer text-[11px] font-medium text-primary hover:underline">Today ▾</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {scheduleItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 group">
            <div className={cn("flex-1 rounded-xl px-3.5 py-2.5 transition-all duration-200 group-hover:shadow-soft", item.color)}>
              <p className="text-[12px] font-semibold">{item.title}</p>
              <p className="text-[10px] opacity-60 mt-0.5">{item.subtitle} • {item.date}</p>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground tabular-nums">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
