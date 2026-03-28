import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/types/account";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export default function AccountCard({
  account,
  onEdit,
  onDelete,
}: AccountCardProps) {
  const avatar = (size: string) => (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: account.color }}
    >
      {account.name[0]}
    </div>
  );

  const actions = (
    <div className="flex gap-0.5 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onEdit(account)}
      >
        <Pencil size={13} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive"
        onClick={() => onDelete(account)}
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );

  return (
    <Card className="p-3.5">
      {/* Mobile: vertical */}
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-2 mb-2">
          {avatar("w-9 h-9 text-sm")}
          {actions}
        </div>
        <p className="text-sm font-semibold truncate">{account.name}</p>
        <p className="text-xs text-muted-foreground truncate mb-1.5">
          {account.account_type_display}
        </p>
        <p className="text-sm font-bold tabular-nums">
          {formatCurrency(account.balance, account.currency)}
        </p>
        {account.account_type === "CREDIT_CARD" &&
          account.available_credit !== null && (
            <p className="text-[11px] text-muted-foreground">
              Disp: {formatCurrency(account.available_credit, account.currency)}
            </p>
          )}
      </div>

      {/* Desktop: 2-row layout */}
      <div className="hidden md:block group">
        <div className="flex items-start gap-3 mb-2">
          {avatar("w-9 h-9 text-sm")}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{account.name}</p>
            <p className="text-xs text-muted-foreground">
              {account.account_type_display}
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(account)}
            >
              <Pencil size={13} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onDelete(account)}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
        <p className="text-base font-bold tabular-nums pl-12">
          {formatCurrency(account.balance, account.currency)}
        </p>
        {account.account_type === "CREDIT_CARD" &&
          account.available_credit !== null && (
            <p className="text-xs text-muted-foreground pl-12">
              Disp: {formatCurrency(account.available_credit, account.currency)}
            </p>
          )}
      </div>
    </Card>
  );
}
