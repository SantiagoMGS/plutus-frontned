import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";
import type {
  Category,
  CategoryCreateRequest,
} from "@/types/category";

export async function getCategories(
  params?: Record<string, string | number>
): Promise<PaginatedResponse<Category>> {
  const res = await apiClient.get<PaginatedResponse<Category>>(
    "/categories/",
    { params }
  );
  return res.data;
}

export async function createCategory(
  data: CategoryCreateRequest
): Promise<Category> {
  const res = await apiClient.post<Category>("/categories/", data);
  return res.data;
}

export async function updateCategory(
  id: number,
  data: Partial<CategoryCreateRequest>
): Promise<Category> {
  const res = await apiClient.patch<Category>(`/categories/${id}/`, data);
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}/`);
}
