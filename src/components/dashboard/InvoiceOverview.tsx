const invoices = [
  { label: "Overdue", amount: "USD 182.00", percent: 85, gradient: "gradient-destructive" },
  { label: "Not Paid", amount: "USD 182.00", percent: 70, gradient: "gradient-warning" },
  { label: "Partially Paid", amount: "USD 175.00", percent: 40, gradient: "gradient-info" },
  { label: "Fully Paid", amount: "USD 180.00", percent: 55, gradient: "gradient-success" },
  { label: "Draft", amount: "USD 100.00", percent: 30, gradient: "gradient-primary" },
];

export function InvoiceOverview() {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card animate-fade-in">
      <h3 className="mb-5 text-[13px] font-semibold text-foreground">Invoice Overview</h3>
      <div className="flex flex-col gap-4">
        {invoices.map((inv) => (
          <div key={inv.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[13px] font-medium text-foreground">{inv.label}</span>
              <span className="text-[12px] tabular-nums text-muted-foreground">{inv.amount}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div className={`h-full rounded-full ${inv.gradient} transition-all duration-700`} style={{ width: `${inv.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
