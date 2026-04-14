import { useLocation } from "react-router";
import { Moon, Sun, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFirebaseAuth } from "@/contexts/auth-context";
import { useLogout } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
  "/": "Inicio",
  "/accounts": "Cuentas",
  "/transactions": "Movimientos",
  "/categories": "Categorías",
  "/profile": "Mi perfil",
};

export default function Header() {
  const { pathname } = useLocation();
  const { firebaseUser } = useFirebaseAuth();
  const logout = useLogout();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const displayName = firebaseUser?.displayName ?? firebaseUser?.email ?? "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border/50 bg-background/95 backdrop-blur-md flex items-center justify-between px-4 md:pl-64">
      <div className="flex items-center gap-2.5">
        <div className="md:hidden w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <TrendingUp size={12} className="text-primary" strokeWidth={2.5} />
        </div>
        <h2 className="text-base font-semibold md:text-lg">
          {pageTitles[pathname] ?? "Plutus"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled
              className="text-xs text-muted-foreground"
            >
              {firebaseUser?.email}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (window.location.href = "/profile")}
            >
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
