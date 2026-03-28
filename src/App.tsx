import { Routes, Route, Navigate } from "react-router";
import { useApiAuth } from "@/hooks/use-api-auth";
import ProtectedRoute from "@/components/protected-route";
import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard";
import AccountsPage from "@/pages/accounts";
import TransactionsPage from "@/pages/transactions";
import CategoriesPage from "@/pages/categories";
import AppLayout from "@/components/layout/app-layout";

export default function App() {
  useApiAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
