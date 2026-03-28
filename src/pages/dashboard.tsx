import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useAccounts } from "@/hooks/use-accounts";
import BalanceCard from "@/components/dashboard/balance-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import type { Account } from "@/types/account";

export default function DashboardPage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts();

  return (
    <div className="space-y-6">
      <BalanceCard />

      {/* Cuentas */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Mis cuentas
        </h3>
        {accountsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-3.5">
                <div className="flex items-center gap-2.5 mb-2">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {(accountsData?.results ?? []).map(
              (account: Account, i: number, arr: Account[]) => (
                <Card
                  key={account.id}
                  className={`p-3.5${arr.length % 2 !== 0 && i === arr.length - 1 ? " col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: account.color }}
                    >
                      {account.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate leading-tight">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {account.account_type_display}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold tabular-nums">
                    {formatCurrency(account.balance, account.currency)}
                  </p>
                </Card>
              ),
            )}
          </div>
        )}
      </div>

      {/* Últimas transacciones */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Últimos movimientos
        </h3>
        <Card className="p-4">
          <RecentTransactions />
        </Card>
      </div>
    </div>
  );
}
