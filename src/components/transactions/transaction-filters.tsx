import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSelect } from "@/components/ui/mobile-select";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAccounts } from "@/hooks/use-accounts";
import type { Account } from "@/types/account";

interface TransactionFiltersProps {
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
}

const transactionTypes = [
  { value: "ALL", label: "Todos" },
  { value: "INCOME", label: "Ingreso" },
  { value: "EXPENSE", label: "Gasto" },
  { value: "TRANSFER", label: "Transferencia" },
];

export default function TransactionFilters({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const { data: accountsData } = useAccounts({ page_size: 100 });
  const accounts = accountsData?.results ?? [];
  const [mobileOpen, setMobileOpen] = useState(false);

  function setFilter(key: string, value: string) {
    const next = { ...filters };
    if (value === "ALL" || value === "") {
      delete next[key];
    } else {
      next[key] = value;
    }
    onFiltersChange(next);
  }

  const accountOptions = [
    { value: "ALL", label: "Todas las cuentas" },
    ...accounts.map((a: Account) => ({ value: String(a.id), label: a.name })),
  ];

  const filterControls = (
    <>
      <MobileSelect
        title="Tipo"
        placeholder="Tipo"
        options={transactionTypes}
        value={filters.transaction_type ?? "ALL"}
        onValueChange={(v) => setFilter("transaction_type", v)}
      />

      <MobileSelect
        title="Cuenta"
        placeholder="Cuenta"
        options={accountOptions}
        value={filters.account ?? "ALL"}
        onValueChange={(v) => setFilter("account", v)}
      />

      <Input
        className="h-11 w-full md:w-48"
        placeholder="Buscar..."
        value={filters.search ?? ""}
        onChange={(e) => setFilter("search", e.target.value)}
      />
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-wrap gap-3">{filterControls}</div>

      {/* Mobile */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger>
            <Button variant="outline" size="sm" className="h-10">
              <SlidersHorizontal size={16} className="mr-2" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 py-4">
              {filterControls}
              <Button
                className="w-full h-11"
                onClick={() => setMobileOpen(false)}
              >
                Aplicar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
