import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";
import type {
  Account,
  AccountCreateRequest,
  AccountSummary,
} from "@/types/account";

export async function getAccounts(
  params?: Record<string, string | number>,
): Promise<PaginatedResponse<Account>> {
  const res = await apiClient.get<PaginatedResponse<Account>>("/accounts/", {
    params,
  });
  return res.data;
}

export async function getAccount(id: number): Promise<Account> {
  const res = await apiClient.get<Account>(`/accounts/${id}/`);
  return res.data;
}

export async function createAccount(
  data: AccountCreateRequest,
): Promise<Account> {
  const res = await apiClient.post<Account>("/accounts/", data);
  return res.data;
}

export async function updateAccount(
  id: number,
  data: Partial<AccountCreateRequest>,
): Promise<Account> {
  const res = await apiClient.patch<Account>(`/accounts/${id}/`, data);
  return res.data;
}

export async function deleteAccount(id: number): Promise<void> {
  await apiClient.delete(`/accounts/${id}/`);
}

export async function getAccountSummary(): Promise<AccountSummary> {
  const res = await apiClient.get<AccountSummary>("/accounts/summary/");
  return res.data;
}
