import { projectWorkData } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function ProjectWork() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Content Breakdown</h3>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <ResponsiveContainer width={110} height={110}>
            <PieChart>
              <Pie data={projectWorkData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="value" strokeWidth={0}>
                {projectWorkData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground">4</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Types</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {projectWorkData.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5 text-[12px]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground min-w-[80px]">{item.name}</span>
              <span className="font-semibold text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
