import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser, login as loginRequest, me } from '../api/auth';
import { getToken, setToken } from '../api/client';

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}

export function useAuthState(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    me()
      .then((result) => setUser(result.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  return useMemo(
    () => ({
      user,
      loading,
      error,
      login: async (email: string, password: string) => {
        setError(null);
        const result = await loginRequest(email, password);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      logout: () => {
        setToken(null);
        setUser(null);
      }
    }),
    [user, loading, error]
  );
}

export { AuthContext };
