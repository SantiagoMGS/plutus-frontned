import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-auth";

export default function ProfileGuard() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && !user.document_type) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
}
