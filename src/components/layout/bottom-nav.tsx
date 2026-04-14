import { NavLink } from "react-router";
import { LayoutDashboard, Wallet, ArrowLeftRight, Tag } from "lucide-react";

const navItems = [
  { label: "Inicio", icon: LayoutDashboard, to: "/" },
  { label: "Cuentas", icon: Wallet, to: "/accounts" },
  { label: "Movimientos", icon: ArrowLeftRight, to: "/transactions" },
  { label: "Categorías", icon: Tag, to: "/categories" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 border-t border-border/50 bg-background/95 backdrop-blur-md z-50 flex items-center justify-around px-2 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-2 relative transition-colors duration-150 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-primary" />
              )}
              <item.icon size={20} strokeWidth={isActive ? 2 : 1.75} />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
