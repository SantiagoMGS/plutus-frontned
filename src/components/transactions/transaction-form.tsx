import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { transactionSchema, type TransactionFormData } from "@/lib/validators";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { useCategories } from "@/hooks/use-categories";
import { format } from "date-fns";
import type { Account } from "@/types/account";
import type { Category } from "@/types/category";

interface TransactionFormProps {
  onSuccess: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const createMutation = useCreateTransaction();
  const { data: accountsData } = useAccounts({ page_size: 100 });
  const accounts = accountsData?.results ?? [];

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transaction_type: "EXPENSE",
      amount: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      account: undefined,
      destination_account: undefined,
      category: undefined,
    },
  });

  const txType = form.watch("transaction_type");
  const selectedAccount = form.watch("account");

  const categoryType = txType === "INCOME" ? "INCOME" : txType === "EXPENSE" ? "EXPENSE" : undefined;
  const { data: categoriesData } = useCategories(
    categoryType ? { category_type: categoryType, page_size: 100 } : undefined
  );
  const categories = categoriesData?.results ?? [];

  function onSubmit(data: TransactionFormData) {
    createMutation.mutate(data, { onSuccess });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="transaction_type"
          render={({ field }) => (
            <FormItem>
              <Tabs
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  form.setValue("category", undefined);
                  form.setValue("destination_account", undefined);
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="INCOME" className="flex-1">
                    Ingreso
                  </TabsTrigger>
                  <TabsTrigger value="EXPENSE" className="flex-1">
                    Gasto
                  </TabsTrigger>
                  <TabsTrigger value="TRANSFER" className="flex-1">
                    Transferencia
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  className="h-11 text-xl font-bold"
                  placeholder="0"
                  inputMode="decimal"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input className="h-11" placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input className="h-11" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {txType === "TRANSFER" ? "Cuenta origen" : "Cuenta"}
              </FormLabel>
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                value={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccionar cuenta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((a: Account) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {txType === "TRANSFER" && (
          <FormField
            control={form.control}
            name="destination_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta destino</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Seleccionar cuenta destino" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts
                      .filter((a: Account) => a.id !== selectedAccount)
                      .map((a: Account) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {txType !== "TRANSFER" && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c: Category) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full h-11"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Crear transacción
        </Button>
      </form>
    </Form>
  );
}
