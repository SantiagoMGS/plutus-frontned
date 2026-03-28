import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import { Loader2, TrendingUp, Wallet, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo y branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <TrendingUp size={28} className="text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plutus</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tu dinero, bajo control
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Wallet size={18} className="text-primary shrink-0" />
            <span>Administra todas tus cuentas en un solo lugar</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <BarChart3 size={18} className="text-primary shrink-0" />
            <span>Visualiza tus ingresos y gastos al instante</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield size={18} className="text-primary shrink-0" />
            <span>Autenticación segura con Auth0</span>
          </div>
        </div>

        {/* Botones de Auth0 */}
        <div className="space-y-3">
          <Button
            className="w-full h-11"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { screen_hint: "login" },
              })
            }
          >
            Iniciar sesión
          </Button>
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { screen_hint: "signup" },
              })
            }
          >
            Crear cuenta
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Al continuar, aceptas nuestros términos de servicio y política de
          privacidad.
        </p>
      </div>
    </div>
  );
}
