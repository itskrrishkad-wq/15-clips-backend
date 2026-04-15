const tasks = [
  { title: "Review trending reels", subtitle: "Content Team", emoji: "🎬", gradient: "gradient-info" },
  { title: "Optimize ad targeting", subtitle: "Marketing", emoji: "🎯", gradient: "gradient-warning" },
  { title: "User feedback analysis", subtitle: "Analytics", emoji: "📈", gradient: "gradient-success" },
];

export function TodaysTasks() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Today's tasks</h3>
        <span className="cursor-pointer text-[11px] font-medium text-primary hover:underline">Manage →</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {tasks.map((task, i) => (
          <div key={i} className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-secondary/60 cursor-pointer">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${task.gradient} shadow-soft text-sm`}>
              {task.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground truncate">{task.title}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{task.subtitle}</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-success opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
