import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  Mail,
  FileText,
  Pencil,
  Loader2,
  Save,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useUser,
  useUpdateProfile,
  useSaveDocumentMetadata,
  useDeleteAccount,
} from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  profileSchema,
  documentMetadataSchema,
  type ProfileFormData,
  type DocumentMetadataFormData,
} from "@/lib/validators";

const DOCUMENT_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PP", label: "Pasaporte" },
  { value: "TI", label: "Tarjeta de Identidad" },
];

const CURRENCIES = [
  { value: "COP", label: "COP — Peso Colombiano" },
  { value: "USD", label: "USD — Dólar" },
  { value: "EUR", label: "EUR — Euro" },
];

function getDocumentLabel(value: string | null) {
  return DOCUMENT_TYPES.find((d) => d.value === value)?.label ?? value;
}

export default function ProfilePage() {
  const { data: user, isLoading } = useUser();
  const updateProfile = useUpdateProfile();
  const updateDocument = useSaveDocumentMetadata();
  const deleteAccount = useDeleteAccount();

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingDocument, setEditingDocument] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const documentForm = useForm<DocumentMetadataFormData>({
    resolver: zodResolver(documentMetadataSchema),
  });

  function openEditProfile() {
    if (!user) return;
    profileForm.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      currency_default: user.currency_default as "COP" | "USD" | "EUR",
    });
    setEditingProfile(true);
  }

  function openEditDocument() {
    if (!user) return;
    documentForm.reset({
      document_type:
        (user.document_type as DocumentMetadataFormData["document_type"]) ??
        undefined,
      document_number: user.document_number ?? "",
    });
    setEditingDocument(true);
  }

  function onProfileSubmit(data: ProfileFormData) {
    updateProfile.mutate(data, {
      onSuccess: () => setEditingProfile(false),
    });
  }

  function onDocumentSubmit(data: DocumentMetadataFormData) {
    updateDocument.mutate(data, {
      onSuccess: () => setEditingDocument(false),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!user) return null;

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Información personal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserIcon size={18} className="text-primary" />
            Información personal
          </CardTitle>
          {!editingProfile && (
            <Button variant="ghost" size="sm" onClick={openEditProfile}>
              <Pencil size={14} className="mr-1.5" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingProfile ? (
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input className="h-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input className="h-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="currency_default"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda predeterminada</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <Loader2 size={14} className="mr-1.5 animate-spin" />
                    ) : (
                      <Save size={14} className="mr-1.5" />
                    )}
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProfile(false)}
                  >
                    <X size={14} className="mr-1.5" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="text-sm font-medium">
                    {user.first_name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Apellido</p>
                  <p className="text-sm font-medium">{user.last_name || "—"}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Correo electrónico
                  </p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Mail size={14} className="text-muted-foreground" />
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Moneda predeterminada
                  </p>
                  <Badge variant="secondary">{user.currency_default}</Badge>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Miembro desde</p>
                <p className="text-sm font-medium">
                  {new Date(user.date_joined).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documento de identidad */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Documento de identidad
          </CardTitle>
          {!editingDocument && (
            <Button variant="ghost" size="sm" onClick={openEditDocument}>
              <Pencil size={14} className="mr-1.5" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingDocument ? (
            <Form {...documentForm}>
              <form
                onSubmit={documentForm.handleSubmit(onDocumentSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={documentForm.control}
                    name="document_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de documento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DOCUMENT_TYPES.map((dt) => (
                              <SelectItem key={dt.value} value={dt.value}>
                                {dt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={documentForm.control}
                    name="document_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de documento</FormLabel>
                        <FormControl>
                          <Input
                            className="h-10"
                            placeholder="Ej: 1234567890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateDocument.isPending}
                  >
                    {updateDocument.isPending ? (
                      <Loader2 size={14} className="mr-1.5 animate-spin" />
                    ) : (
                      <Save size={14} className="mr-1.5" />
                    )}
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDocument(false)}
                  >
                    <X size={14} className="mr-1.5" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <p className="text-sm font-medium">
                  {user.document_type
                    ? getDocumentLabel(user.document_type)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Número</p>
                <p className="text-sm font-medium">
                  {user.document_number || "—"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zona peligrosa */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <Trash2 size={18} />
            Zona peligrosa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Al eliminar tu cuenta se desactivará permanentemente tu acceso y
            todos tus datos asociados.
          </p>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" size="sm">
                <Trash2 size={14} className="mr-1.5" />
                Eliminar mi cuenta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Tu cuenta será desactivada y
                  perderás acceso a todos tus datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteAccount.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : null}
                  Sí, eliminar cuenta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
