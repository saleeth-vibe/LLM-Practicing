import { api } from './client';

export type Role = 'admin' | 'faculty' | 'student';

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: Role;
};

export function login(email: string, password: string) {
  return api<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function me() {
  return api<{ user: AuthUser }>('/api/auth/me');
}
