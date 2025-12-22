// api/auth.ts - Auth endpoints
import http from './http';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  name?: string;
  email?: string;
  message?: string;
}

export const authApi = {
  register: (data: RegisterData): Promise<AuthResponse> =>
    http.post('/api/v1/auth/register', data).then(res => res.data),

  login: (data: LoginData): Promise<AuthResponse> =>
    http.post('/api/v1/auth/login', data).then(res => res.data),
};