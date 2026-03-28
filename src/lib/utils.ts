import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatters: Record<string, Intl.NumberFormat> = {};

function getFormatter(currency: string): Intl.NumberFormat {
  if (!currencyFormatters[currency]) {
    currencyFormatters[currency] = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "COP" ? 0 : 2,
      maximumFractionDigits: currency === "COP" ? 0 : 2,
    });
  }
  return currencyFormatters[currency];
}

export function formatCurrency(
  amount: string | number,
  currency: string = "COP",
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return getFormatter(currency).format(num);
}
