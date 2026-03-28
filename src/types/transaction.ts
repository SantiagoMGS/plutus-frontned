export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Transaction {
  id: number;
  transaction_type: TransactionType;
  transaction_type_display: string;
  amount: string;
  description: string;
  date: string;
  account: number;
  account_name: string;
  destination_account: number | null;
  destination_account_name: string | null;
  category: number | null;
  category_name: string | null;
  created_at: string;
}

export interface TransactionCreateRequest {
  transaction_type: TransactionType;
  amount: string;
  description?: string;
  date: string;
  account: number;
  destination_account?: number;
  category?: number;
}

export interface TransactionSummary {
  total_income: number;
  total_expenses: number;
  net: number;
  transaction_count: number;
}
