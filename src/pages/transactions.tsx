import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useTransactions,
  useDeleteTransaction,
} from "@/hooks/use-transactions";
import TransactionFilters from "@/components/transactions/transaction-filters";
import TransactionForm from "@/components/transactions/transaction-form";
import TransactionList from "@/components/transactions/transaction-list";
import type { Transaction } from "@/types/transaction";

export default function TransactionsPage() {
  const isDesktop = useIsDesktop();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingTx, setDeletingTx] = useState<Transaction | undefined>();

  const queryParams = { ...filters, page, ordering: "-date" };
  const { data, isLoading } = useTransactions(queryParams);
  const deleteMutation = useDeleteTransaction();

  function handleFiltersChange(newFilters: Record<string, string>) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleFormSuccess() {
    setFormOpen(false);
  }

  function handleDelete() {
    if (deletingTx) {
      deleteMutation.mutate(deletingTx.id, {
        onSuccess: () => setDeletingTx(undefined),
      });
    }
  }

  const formContent = <TransactionForm onSuccess={handleFormSuccess} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Movimientos</h1>
        <Button onClick={() => setFormOpen(true)} className="h-10">
          <Plus size={16} className="mr-2" />
          Nuevo
        </Button>
      </div>

      <TransactionFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <TransactionList
        data={data}
        isLoading={isLoading}
        onDelete={setDeletingTx}
        page={page}
        onPageChange={setPage}
      />

      {/* Form — Sheet on mobile, Dialog on desktop */}
      {isDesktop ? (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva transacción</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={formOpen} onOpenChange={setFormOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Nueva transacción</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4">{formContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingTx}
        onOpenChange={(open) => {
          if (!open) setDeletingTx(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar transacción?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará esta transacción y se revertirá el balance. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
