import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
} from "@/api/accounts";
import type { AccountCreateRequest } from "@/types/account";

export function useAccounts(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["accounts", params],
    queryFn: () => getAccounts(params),
  });
}

export function useAccountSummary() {
  return useQuery({
    queryKey: ["accounts", "summary"],
    queryFn: getAccountSummary,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AccountCreateRequest) => createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Cuenta creada");
    },
    onError: () => toast.error("Error al crear cuenta"),
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<AccountCreateRequest>;
    }) => updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Cuenta actualizada");
    },
    onError: () => toast.error("Error al actualizar cuenta"),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Cuenta eliminada");
    },
    onError: () => toast.error("Error al eliminar cuenta"),
  });
}
