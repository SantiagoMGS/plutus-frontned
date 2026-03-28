export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  currency_default: string;
  date_joined: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  currency_default?: string;
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}
