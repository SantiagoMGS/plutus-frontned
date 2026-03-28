import apiClient from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ChangePasswordRequest,
} from "@/types/auth";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/auth/login/", data);
  return res.data;
}

export async function register(data: RegisterRequest): Promise<User> {
  const res = await apiClient.post<User>("/auth/register/", data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>("/auth/me/");
  return res.data;
}

export async function updateMe(
  data: Partial<Pick<User, "first_name" | "last_name" | "currency_default">>,
): Promise<User> {
  const res = await apiClient.patch<User>("/auth/me/", data);
  return res.data;
}

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<void> {
  await apiClient.post("/auth/change-password/", data);
}
