import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useTxSummary } from "@/hooks/use-transactions";

export default function BalanceCard() {
  const { data, isLoading } = useTxSummary();

  if (isLoading) {
    return (
      <>
        <div className="sm:hidden space-y-3">
          <Card className="p-5">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-9 w-36" />
          </Card>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-6 w-24" />
              </Card>
            ))}
          </div>
        </div>
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-32" />
            </Card>
          ))}
        </div>
      </>
    );
  }

  const cards = [
    {
      label: "Ingresos",
      value: data?.total_income ?? 0,
      color: "text-emerald-500",
      icon: ArrowDownLeft,
    },
    {
      label: "Gastos",
      value: data?.total_expenses ?? 0,
      color: "text-red-500",
      icon: ArrowUpRight,
    },
    {
      label: "Balance neto",
      value: data?.net ?? 0,
      color: "text-foreground",
      icon: TrendingUp,
    },
  ];

  const [income, expenses, net] = cards;

  return (
    <>
      {/* Mobile: hero layout */}
      <div className="sm:hidden space-y-3">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {net.label}
            </span>
            <net.icon size={14} className={net.color} />
          </div>
          <p className={`text-3xl font-bold tabular-nums ${net.color}`}>
            {formatCurrency(net.value)}
          </p>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {[income, expenses].map((card) => (
            <Card key={card.label} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <card.icon size={13} className={card.color} />
              </div>
              <p className={`text-lg font-bold tabular-nums ${card.color}`}>
                {formatCurrency(card.value)}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop: 3 columns */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon size={16} className={card.color} />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
