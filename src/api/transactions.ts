import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionSummary,
} from "@/types/transaction";

export async function getTransactions(
  params?: Record<string, string | number>
): Promise<PaginatedResponse<Transaction>> {
  const res = await apiClient.get<PaginatedResponse<Transaction>>(
    "/transactions/",
    { params }
  );
  return res.data;
}

export async function getTransaction(id: number): Promise<Transaction> {
  const res = await apiClient.get<Transaction>(`/transactions/${id}/`);
  return res.data;
}

export async function createTransaction(
  data: TransactionCreateRequest
): Promise<Transaction> {
  const res = await apiClient.post<Transaction>("/transactions/", data);
  return res.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`/transactions/${id}/`);
}

export async function getTransactionSummary(
  params?: Record<string, string>
): Promise<TransactionSummary> {
  const res = await apiClient.get<TransactionSummary>(
    "/transactions/summary/",
    { params }
  );
  return res.data;
}
