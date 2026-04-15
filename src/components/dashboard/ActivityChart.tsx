import { activityData } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

export function ActivityChart() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Activity</h3>
        <span className="rounded-lg bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">↑ 12.67%</span>
      </div>
      <div className="my-3 text-center">
        <span className="text-4xl font-bold tracking-tight text-foreground">75%</span>
        <p className="mt-1 text-[11px] text-muted-foreground">Weekly engagement</p>
      </div>
      <ResponsiveContainer width="100%" height={70}>
        <BarChart data={activityData} barSize={20}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {activityData.map((entry, index) => (
              <Cell key={index} fill={entry.value > 60 ? "#685AFF" : entry.value > 0 ? "#B7BDF7" : "hsl(var(--muted))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
