import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
} from "@/api/transactions";
import type { TransactionCreateRequest } from "@/types/transaction";

export function useTransactions(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });
}

export function useTxSummary(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["transactions", "summary", params],
    queryFn: () => getTransactionSummary(params),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransactionCreateRequest) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Transacción creada");
    },
    onError: () => toast.error("Error al crear transacción"),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Transacción eliminada");
    },
    onError: () => toast.error("Error al eliminar transacción"),
  });
}
