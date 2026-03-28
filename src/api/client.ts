import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Token getter set by useApiAuth hook (Auth0 SDK)
let tokenGetter: (() => Promise<string>) | null = null;

export function setTokenGetter(getter: () => Promise<string>) {
  tokenGetter = getter;
}

apiClient.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Token retrieval failed — request goes without auth
    }
  }
  return config;
});

export default apiClient;
