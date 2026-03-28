export type AccountType = "BANK" | "WALLET" | "CREDIT_CARD" | "CASH";
export type Currency = "COP" | "USD" | "EUR";

export interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  account_type_display: string;
  currency: Currency;
  balance: string;
  color: string;
  icon: string;
  credit_limit: string | null;
  interest_rate: string | null;
  cut_off_day: number | null;
  payment_day: number | null;
  available_credit: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountCreateRequest {
  name: string;
  account_type: AccountType;
  currency?: Currency;
  color?: string;
  icon?: string;
  credit_limit?: string;
  interest_rate?: string;
  cut_off_day?: number;
  payment_day?: number;
}

export interface AccountSummary {
  balances_by_currency: Record<string, number>;
  available_credit: number;
}
