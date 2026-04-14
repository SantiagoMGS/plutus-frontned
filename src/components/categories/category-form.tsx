import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Tag,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Heart,
  Briefcase,
  GraduationCap,
  Plane,
  Gamepad2,
  Music,
  Shirt,
  Dumbbell,
  Wifi,
  Phone,
  Gift,
  Baby,
  PiggyBank,
  TrendingUp,
  Landmark,
  Wallet,
  CreditCard,
  Banknote,
  Receipt,
  Lightbulb,
  Droplets,
  Flame,
  Bus,
  Stethoscope,
  Pill,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categorySchema, type CategoryFormData } from "@/lib/validators";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import type { Category } from "@/types/category";
import { cn } from "@/lib/utils";

const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "tag", label: "Etiqueta", icon: Tag },
  { value: "shopping-cart", label: "Compras", icon: ShoppingCart },
  { value: "home", label: "Hogar", icon: Home },
  { value: "car", label: "Auto", icon: Car },
  { value: "utensils", label: "Comida", icon: Utensils },
  { value: "heart", label: "Salud", icon: Heart },
  { value: "briefcase", label: "Trabajo", icon: Briefcase },
  { value: "graduation-cap", label: "Educación", icon: GraduationCap },
  { value: "plane", label: "Viajes", icon: Plane },
  { value: "gamepad-2", label: "Juegos", icon: Gamepad2 },
  { value: "music", label: "Música", icon: Music },
  { value: "shirt", label: "Ropa", icon: Shirt },
  { value: "dumbbell", label: "Gym", icon: Dumbbell },
  { value: "wifi", label: "Internet", icon: Wifi },
  { value: "phone", label: "Teléfono", icon: Phone },
  { value: "gift", label: "Regalos", icon: Gift },
  { value: "baby", label: "Hijos", icon: Baby },
  { value: "piggy-bank", label: "Ahorro", icon: PiggyBank },
  { value: "trending-up", label: "Inversión", icon: TrendingUp },
  { value: "landmark", label: "Banco", icon: Landmark },
  { value: "wallet", label: "Billetera", icon: Wallet },
  { value: "credit-card", label: "Tarjeta", icon: CreditCard },
  { value: "banknote", label: "Efectivo", icon: Banknote },
  { value: "receipt", label: "Recibo", icon: Receipt },
  { value: "lightbulb", label: "Luz", icon: Lightbulb },
  { value: "droplets", label: "Agua", icon: Droplets },
  { value: "flame", label: "Gas", icon: Flame },
  { value: "bus", label: "Transporte", icon: Bus },
  { value: "stethoscope", label: "Médico", icon: Stethoscope },
  { value: "pill", label: "Medicina", icon: Pill },
];

const COLOR_OPTIONS = [
  "#EF4444", "#F97316", "#F59E0B", "#EAB308",
  "#84CC16", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
  "#8B5CF6", "#A855F7", "#D946EF", "#EC4899",
  "#F43F5E", "#78716C", "#64748B", "#1E293B",
];

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
}: CategoryFormProps) {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditing = !!category;

  const form = useForm<CategoryFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: category?.name ?? "",
      category_type: category?.category_type ?? "EXPENSE",
      icon: category?.icon ?? "tag",
      color: category?.color ?? "#6366F1",
    },
  });

  function onSubmit(data: CategoryFormData) {
    if (isEditing) {
      updateMutation.mutate({ id: category.id, data }, { onSuccess });
    } else {
      createMutation.mutate(data, { onSuccess });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input className="h-11" placeholder="Ej: Crypto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange("EXPENSE")}
                    className={cn(
                      "flex-1 h-11 rounded-md border text-sm font-medium transition-colors",
                      field.value === "EXPENSE"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("INCOME")}
                    className={cn(
                      "flex-1 h-11 rounded-md border text-sm font-medium transition-colors",
                      field.value === "INCOME"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    Ingreso
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícono</FormLabel>
              <FormControl>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      title={label}
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-md border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                        field.value === value &&
                          "border-primary bg-primary/10 text-primary"
                      )}
                    >
                      <Icon size={18} />
                      <span className="text-[10px] leading-tight truncate w-full text-center">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        field.value === color
                          ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-11" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guardar cambios" : "Crear categoría"}
        </Button>
      </form>
    </Form>
  );
}
