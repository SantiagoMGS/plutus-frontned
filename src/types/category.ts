export type CategoryType = "INCOME" | "EXPENSE";

export interface Category {
  id: number;
  name: string;
  category_type: CategoryType;
  category_type_display: string;
  icon: string;
  color: string;
  is_default: boolean;
}

export interface CategoryCreateRequest {
  name: string;
  category_type: CategoryType;
  icon?: string;
  color?: string;
}
