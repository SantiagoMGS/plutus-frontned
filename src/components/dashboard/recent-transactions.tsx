import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction } from "@/types/transaction";

const typeConfig = {
  INCOME: {
    icon: ArrowDownLeft,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    prefix: "+",
  },
  EXPENSE: {
    icon: ArrowUpRight,
    color: "text-red-500",
    bg: "bg-red-500/10",
    prefix: "-",
  },
  TRANSFER: {
    icon: ArrowLeftRight,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    prefix: "",
  },
};

export default function RecentTransactions() {
  const { data, isLoading } = useTransactions({
    ordering: "-date",
    page_size: 5,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const transactions = data?.results ?? [];

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No hay transacciones aún
      </p>
    );
  }

  return (
    <div>
      {transactions.map((tx: Transaction) => {
        const config = typeConfig[tx.transaction_type];
        const Icon = config.icon;
        return (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${config.bg}`}
              >
                <Icon size={16} className={config.color} />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {tx.description || tx.transaction_type_display}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tx.account_name}
                  {tx.destination_account_name &&
                    ` → ${tx.destination_account_name}`}{" "}
                  · {tx.date}
                </p>
              </div>
            </div>
            <span className={`text-sm font-bold tabular-nums ${config.color}`}>
              {config.prefix}
              {formatCurrency(tx.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
