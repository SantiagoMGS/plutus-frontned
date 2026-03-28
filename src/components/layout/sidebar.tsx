import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tag,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Inicio", icon: LayoutDashboard, to: "/" },
  { label: "Cuentas", icon: Wallet, to: "/accounts" },
  { label: "Movimientos", icon: ArrowLeftRight, to: "/transactions" },
  { label: "Categorías", icon: Tag, to: "/categories" },
];

export default function Sidebar() {
  const logout = useLogout();

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen border-r border-border/50 bg-sidebar fixed left-0 top-0 z-40">
      <div className="px-4 py-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <TrendingUp size={14} className="text-primary-foreground" strokeWidth={2.5} />
        </div>
        <h1 className="text-base font-bold tracking-tight">Plutus</h1>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`
            }
          >
            <item.icon size={17} strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground h-9 text-sm"
          onClick={logout}
        >
          <LogOut size={15} className="mr-2.5" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
