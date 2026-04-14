import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileSelect } from "@/components/ui/mobile-select";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { accountSchema, type AccountFormData } from "@/lib/validators";
import { useCreateAccount, useUpdateAccount } from "@/hooks/use-accounts";
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

const COLOR_OPTIONS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#78716C",
  "#64748B",
  "#1E293B",
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
      updateMutation.mutate({ id: account.id, data }, { onSuccess });
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
                <Input
                  className="h-11"
                  placeholder="Ej: Davivienda"
                  {...field}
                />
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
              <FormControl>
                <MobileSelect
                  title="Tipo de cuenta"
                  placeholder="Seleccionar tipo"
                  options={accountTypes}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
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
              <FormControl>
                <MobileSelect
                  title="Moneda"
                  placeholder="Seleccionar moneda"
                  options={currencies}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
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
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        field.value === color
                          ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                          : "hover:scale-110",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormControl>
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
                    <Input className="h-11" placeholder="5000000" {...field} />
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
                            e.target.value ? Number(e.target.value) : undefined,
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
                            e.target.value ? Number(e.target.value) : undefined,
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
