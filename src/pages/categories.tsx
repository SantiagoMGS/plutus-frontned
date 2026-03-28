import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useIsDesktop } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import CategoryForm from "@/components/categories/category-form";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const isDesktop = useIsDesktop();
  const { data: expenseData, isLoading: expLoading } = useCategories({
    category_type: "EXPENSE",
    page_size: 100,
  });
  const { data: incomeData, isLoading: incLoading } = useCategories({
    category_type: "INCOME",
    page_size: 100,
  });
  const deleteMutation = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [deletingCategory, setDeletingCategory] = useState<
    Category | undefined
  >();

  function openCreate() {
    setEditingCategory(undefined);
    setFormOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingCategory(cat);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    setFormOpen(false);
    setEditingCategory(undefined);
  }

  function handleDelete() {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id, {
        onSuccess: () => setDeletingCategory(undefined),
      });
    }
  }

  function renderGrid(categories: Category[], loading: boolean) {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cat.name}</p>
                {cat.is_default && (
                  <Badge variant="secondary" className="text-[10px]">
                    Sistema
                  </Badge>
                )}
              </div>
            </div>
            <div
              className={`flex justify-end gap-1 ${cat.is_default ? "invisible" : ""}`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => openEdit(cat)}
              >
                <Pencil size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => setDeletingCategory(cat)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formContent = (
    <CategoryForm category={editingCategory} onSuccess={handleFormSuccess} />
  );
  const formTitle = editingCategory ? "Editar categoría" : "Nueva categoría";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Categorías</h1>
        <Button onClick={openCreate} className="h-10">
          <Plus size={16} className="mr-2" />
          Nueva
        </Button>
      </div>

      <Tabs defaultValue="EXPENSE">
        <TabsList>
          <TabsTrigger value="EXPENSE">Gastos</TabsTrigger>
          <TabsTrigger value="INCOME">Ingresos</TabsTrigger>
        </TabsList>
        <TabsContent value="EXPENSE" className="mt-4">
          {renderGrid(expenseData?.results ?? [], expLoading)}
        </TabsContent>
        <TabsContent value="INCOME" className="mt-4">
          {renderGrid(incomeData?.results ?? [], incLoading)}
        </TabsContent>
      </Tabs>

      {/* Form */}
      {isDesktop ? (
        <Dialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingCategory(undefined);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{formTitle}</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingCategory(undefined);
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{formTitle}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4">{formContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Delete */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará "{deletingCategory?.name}". Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
