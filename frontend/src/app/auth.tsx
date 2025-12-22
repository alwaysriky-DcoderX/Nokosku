import { createContext, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, register as registerApi } from '../api/auth';
import { getProfile } from '../api/user';
import type { Profile } from '../api/user';
import { getStoredToken, setStoredToken } from '../api/http';

type AuthContextType = {
  token: string;
  profile?: Profile;
  isProfileLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>(() => getStoredToken());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token
  });

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const res = await loginApi(payload);
    setStoredToken(res.token);
    setToken(res.token);
    await queryClient.invalidateQueries({ queryKey: ['profile'] });
  }, [queryClient]);

  const register = useCallback(async (payload: { email: string; password: string; name?: string }) => {
    await registerApi(payload);
    await login({ email: payload.email, password: payload.password });
  }, [login]);

  const logout = useCallback(() => {
    setStoredToken('');
    setToken('');
    queryClient.clear();
    navigate('/login', { replace: true });
  }, [queryClient, navigate]);

  const value = useMemo(
    () => ({
      token,
      profile,
      isProfileLoading,
      login,
      register,
      logout
    }),
    [token, profile, isProfileLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


