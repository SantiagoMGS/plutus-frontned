import apiClient from "./client";
import type { User, DocumentMetadataRequest } from "@/types/auth";

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

export async function saveDocumentMetadata(
  data: DocumentMetadataRequest,
): Promise<User> {
  const res = await apiClient.post<User>("/auth/metadata/", data);
  return res.data;
}

export async function deleteMe(): Promise<void> {
  await apiClient.delete("/auth/me/");
}
