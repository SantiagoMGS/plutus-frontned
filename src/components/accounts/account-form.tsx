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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { accountSchema, type AccountFormData } from "@/lib/validators";
import {
  useCreateAccount,
  useUpdateAccount,
} from "@/hooks/use-accounts";
import type { Account } from "@/types/account";

interface AccountFormProps {
  account?: Account;
  onSuccess: () => void;
}

const accountTypes = [
  { value: "BANK", label: "Cuenta Bancaria" },
  { value: "WALLET", label: "Billetera Digital" },
  { value: "CREDIT_CARD", label: "Tarjeta de Crédito" },
  { value: "CASH", label: "Efectivo" },
];

const currencies = [
  { value: "COP", label: "COP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

export default function AccountForm({ account, onSuccess }: AccountFormProps) {
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const isEditing = !!account;

  const form = useForm<AccountFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(accountSchema) as any,
    defaultValues: {
      name: account?.name ?? "",
      account_type: account?.account_type ?? "BANK",
      currency: account?.currency ?? "COP",
      color: account?.color ?? "#4F46E5",
      icon: account?.icon ?? "wallet",
      credit_limit: account?.credit_limit ?? undefined,
      interest_rate: account?.interest_rate ?? undefined,
      cut_off_day: account?.cut_off_day ?? undefined,
      payment_day: account?.payment_day ?? undefined,
    },
  });

  const watchType = form.watch("account_type");
  const isCreditCard = watchType === "CREDIT_CARD";

  function onSubmit(data: AccountFormData) {
    if (isEditing) {
      updateMutation.mutate(
        { id: account.id, data },
        { onSuccess }
      );
    } else {
      createMutation.mutate(data, { onSuccess });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input className="h-11" placeholder="Ej: Davivienda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de cuenta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: field.value }}
                />
                <FormControl>
                  <Input className="h-11" placeholder="#4F46E5" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCreditCard && (
          <>
            <FormField
              control={form.control}
              name="credit_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Límite de crédito</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="5000000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de interés (%)</FormLabel>
                  <FormControl>
                    <Input className="h-11" placeholder="2.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cut_off_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Día de corte</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        type="number"
                        min={1}
                        max={31}
                        placeholder="15"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Día de pago</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        type="number"
                        min={1}
                        max={31}
                        placeholder="5"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full h-11" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guardar cambios" : "Crear cuenta"}
        </Button>
      </form>
    </Form>
  );
}
