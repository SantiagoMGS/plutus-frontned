import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";
import type { PaginatedResponse } from "@/types/api";

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

interface TransactionListProps {
  data?: PaginatedResponse<Transaction>;
  isLoading: boolean;
  onDelete: (tx: Transaction) => void;
  page: number;
  onPageChange: (page: number) => void;
}

export default function TransactionList({
  data,
  isLoading,
  onDelete,
  page,
  onPageChange,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-20" />
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
        No hay transacciones
      </p>
    );
  }

  return (
    <>
      {/* Mobile list */}
      <div className="md:hidden">
        {transactions.map((tx) => {
          const config = typeConfig[tx.transaction_type];
          const Icon = config.icon;
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-3 border-b last:border-0"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}
              >
                <Icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {tx.description || tx.transaction_type_display}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {tx.account_name}
                  {tx.destination_account_name &&
                    ` → ${tx.destination_account_name}`}
                </p>
                <p className="text-[11px] text-muted-foreground/70">
                  {tx.date}
                </p>
              </div>
              <span
                className={`text-sm font-bold tabular-nums shrink-0 ${config.color}`}
              >
                {config.prefix}
                {formatCurrency(tx.amount)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive"
                onClick={() => onDelete(tx)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const config = typeConfig[tx.transaction_type];
              const Icon = config.icon;
              return (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}
                    >
                      <Icon size={14} className={config.color} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.description || tx.transaction_type_display}
                  </TableCell>
                  <TableCell>
                    {tx.account_name}
                    {tx.destination_account_name &&
                      ` → ${tx.destination_account_name}`}
                  </TableCell>
                  <TableCell>{tx.category_name ?? "—"}</TableCell>
                  <TableCell
                    className={`text-right font-bold tabular-nums ${config.color}`}
                  >
                    {config.prefix}
                    {formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onDelete(tx)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-xs text-muted-foreground">
          {data?.count ?? 0} resultados
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!data?.previous}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!data?.next}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}
