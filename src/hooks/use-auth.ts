import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { getMe, updateMe, saveDocumentMetadata, deleteMe } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import type { User, DocumentMetadataRequest } from "@/types/auth";

export function useUser() {
  const { isAuthenticated } = useAuth0();
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
  const { logout: auth0Logout } = useAuth0();
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success("Cuenta eliminada exitosamente");
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    },
    onError: () => {
      toast.error("Error al eliminar la cuenta");
    },
  });
}

export function useLogout() {
  const { logout: auth0Logout } = useAuth0();
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return () => {
    clearUser();
    queryClient.clear();
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };
}
