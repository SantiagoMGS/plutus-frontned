import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMe, updateMe, saveDocumentMetadata, deleteMe } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useFirebaseAuth } from "@/contexts/auth-context";
import type { User, DocumentMetadataRequest } from "@/types/auth";

export function useUser() {
  const { isAuthenticated } = useFirebaseAuth();
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
}

export function useSaveDocumentMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DocumentMetadataRequest) => saveDocumentMetadata(data),
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      queryClient.setQueryData(["user", "me"], user);
      toast.success("Documento guardado exitosamente");
    },
    onError: () => {
      toast.error("Error al guardar el documento");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Partial<
        Pick<User, "first_name" | "last_name" | "currency_default">
      >,
    ) => updateMe(data),
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast.success("Perfil actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el perfil");
    },
  });
}

export function useDeleteAccount() {
  const { logout } = useFirebaseAuth();
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: async () => {
      clearUser();
      queryClient.clear();
      toast.success("Cuenta eliminada exitosamente");
      await logout();
    },
    onError: () => {
      toast.error("Error al eliminar la cuenta");
    },
  });
}

export function useLogout() {
  const { logout } = useFirebaseAuth();
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return () => {
    clearUser();
    queryClient.clear();
    logout();
  };
}
