import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Requerido"),
  password: z.string().min(1, "Requerido"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirm"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const accountSchema = z
  .object({
    name: z.string().min(1, "Requerido").max(100),
    account_type: z.enum(["BANK", "WALLET", "CREDIT_CARD", "CASH"]),
    currency: z.enum(["COP", "USD", "EUR"]).default("COP"),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Color hex inválido")
      .default("#4F46E5"),
    icon: z.string().default("wallet"),
    credit_limit: z.string().optional(),
    interest_rate: z.string().optional(),
    cut_off_day: z.coerce.number().min(1).max(31).optional(),
    payment_day: z.coerce.number().min(1).max(31).optional(),
  })
  .refine(
    (data) => {
      if (data.account_type === "CREDIT_CARD") {
        return !!data.credit_limit && parseFloat(data.credit_limit) > 0;
      }
      return true;
    },
    {
      message: "Límite de crédito es obligatorio para tarjetas de crédito",
      path: ["credit_limit"],
    },
  );

export type AccountFormData = z.infer<typeof accountSchema>;

export const transactionSchema = z
  .object({
    transaction_type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
    amount: z.string().refine((v) => parseFloat(v) > 0, "Debe ser mayor a 0"),
    description: z.string().max(255).optional(),
    date: z.string(),
    account: z.number({ error: "Selecciona una cuenta" }),
    destination_account: z.number().optional(),
    category: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.transaction_type === "TRANSFER") {
        return data.destination_account !== undefined;
      }
      return true;
    },
    {
      message: "Cuenta destino es obligatoria en transferencias",
      path: ["destination_account"],
    },
  )
  .refine(
    (data) => {
      if (data.transaction_type === "TRANSFER") {
        return data.destination_account !== data.account;
      }
      return true;
    },
    {
      message: "Cuenta destino debe ser diferente a cuenta origen",
      path: ["destination_account"],
    },
  );

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Requerido").max(100),
  category_type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().default("tag"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color hex inválido")
    .default("#6366F1"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
