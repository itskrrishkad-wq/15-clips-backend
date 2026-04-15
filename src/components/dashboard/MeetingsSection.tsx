import { Video } from "lucide-react";

const meetings = [
  { time: "10:00", period: "AM", title: "Review reel content strategy", emoji: "🎯", gradient: "gradient-info" },
  { time: "01:00", period: "PM", title: "Ad campaign performance review", emoji: "📊", gradient: "gradient-warning" },
  { time: "03:00", period: "PM", title: "Team sync & user analytics", emoji: "👥", gradient: "gradient-primary" },
];

export function MeetingsSection() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Today's meetings</h3>
        <span className="cursor-pointer text-[11px] font-medium text-primary hover:underline">View All →</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {meetings.map((m, i) => (
          <div key={i} className="group flex flex-col items-center gap-2 rounded-xl bg-secondary/50 p-3.5 text-center transition-all duration-200 hover:bg-secondary hover:shadow-soft cursor-pointer">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.gradient} text-sm shadow-soft`}>
              {m.emoji}
            </div>
            <div>
              <span className="text-lg font-bold tabular-nums text-foreground">{m.time}</span>
              <span className="ml-0.5 text-[10px] text-muted-foreground">{m.period}</span>
            </div>
            <p className="text-[10px] leading-tight text-muted-foreground">{m.title}</p>
          </div>
        ))}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-[11px] font-medium text-primary transition-colors hover:bg-accent hover:border-primary/30">
        <Video className="h-3.5 w-3.5" />
        Schedule meeting
      </button>
    </div>
  );
}
