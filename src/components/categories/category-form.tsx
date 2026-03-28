import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">Ingreso</SelectItem>
                  <SelectItem value="EXPENSE">Gasto</SelectItem>
                </SelectContent>
              </Select>
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
                <Input className="h-11" placeholder="tag" {...field} />
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
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: field.value }}
                />
                <FormControl>
                  <Input className="h-11" placeholder="#6366F1" {...field} />
                </FormControl>
              </div>
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
