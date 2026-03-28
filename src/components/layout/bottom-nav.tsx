import { NavLink } from "react-router";
import { LayoutDashboard, Wallet, ArrowLeftRight, Tag, UserCog } from "lucide-react";

const navItems = [
  { label: "Inicio", icon: LayoutDashboard, to: "/" },
  { label: "Cuentas", icon: Wallet, to: "/accounts" },
  { label: "Movimientos", icon: ArrowLeftRight, to: "/transactions" },
  { label: "Categorías", icon: Tag, to: "/categories" },
  { label: "Perfil", icon: UserCog, to: "/profile" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 border-t border-border/50 bg-background/95 backdrop-blur-md z-50 flex items-center justify-around px-3 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <item.icon size={20} strokeWidth={1.75} />
          <span className="text-[10px] font-medium leading-none">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
