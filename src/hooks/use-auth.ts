import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { login, register, getMe } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

export function useLogin() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const tokens = await login(data);
      setTokens(tokens.access, tokens.refresh);
      const user = await getMe();
      setUser(user);
      return user;
    },
    onSuccess: () => {
      toast.success("Sesión iniciada");
      navigate("/");
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      toast.success("Cuenta creada. Inicia sesión.");
      navigate("/login");
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      toast.error(msg);
    },
  });
}

export function useUser() {
  const { isAuthenticated, setUser } = useAuthStore();

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

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return () => {
    logout();
    queryClient.clear();
    navigate("/login");
    toast.success("Sesión cerrada");
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const res = (error as { response?: { data?: Record<string, unknown> } })
      .response;
    if (res?.data) {
      if (typeof res.data.detail === "string") return res.data.detail;
      const firstKey = Object.keys(res.data)[0];
      if (firstKey) {
        const val = res.data[firstKey];
        if (Array.isArray(val)) return val[0] as string;
        if (typeof val === "string") return val;
      }
    }
  }
  return "Ocurrió un error inesperado";
}
