import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
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
import { useIsDesktop } from "@/hooks/use-media-query";
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
import { useAccounts, useAccountSummary, useDeleteAccount } from "@/hooks/use-accounts";
import { formatCurrency } from "@/lib/utils";
import AccountCard from "@/components/accounts/account-card";
import AccountForm from "@/components/accounts/account-form";
import type { Account } from "@/types/account";

export default function AccountsPage() {
  const isDesktop = useIsDesktop();
  const { data, isLoading } = useAccounts();
  const { data: summary } = useAccountSummary();
  const deleteMutation = useDeleteAccount();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [deletingAccount, setDeletingAccount] = useState<Account | undefined>();

  function openCreate() {
    setEditingAccount(undefined);
    setFormOpen(true);
  }

  function openEdit(account: Account) {
    setEditingAccount(account);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    setFormOpen(false);
    setEditingAccount(undefined);
  }

  function handleDelete() {
    if (deletingAccount) {
      deleteMutation.mutate(deletingAccount.id, {
        onSuccess: () => setDeletingAccount(undefined),
      });
    }
  }

  const formContent = (
    <AccountForm account={editingAccount} onSuccess={handleFormSuccess} />
  );

  const formTitle = editingAccount ? "Editar cuenta" : "Nueva cuenta";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Cuentas</h1>
        <Button onClick={openCreate} className="h-10">
          <Plus size={16} className="mr-2" />
          Nueva cuenta
        </Button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="flex flex-wrap gap-4">
          {Object.entries(summary.balances_by_currency).map(
            ([currency, balance]) => (
              <Card key={currency} className="p-3">
                <p className="text-xs text-muted-foreground">
                  Balance {currency}
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {formatCurrency(balance, currency)}
                </p>
              </Card>
            )
          )}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {(data?.results ?? []).map((account, i, arr) => (
            <div
              key={account.id}
              className={arr.length % 2 !== 0 && i === arr.length - 1 ? "col-span-2 lg:col-span-1" : ""}
            >
              <AccountCard
                account={account}
                onEdit={openEdit}
                onDelete={setDeletingAccount}
              />
            </div>
          ))}
        </div>
      )}

      {/* Form — Sheet on mobile, Dialog on desktop */}
      {isDesktop ? (
        <Dialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingAccount(undefined);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{formTitle}</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingAccount(undefined);
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{formTitle}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4">{formContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingAccount}
        onOpenChange={(open) => {
          if (!open) setDeletingAccount(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará "{deletingAccount?.name}". Esta acción no se puede
              deshacer.
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
