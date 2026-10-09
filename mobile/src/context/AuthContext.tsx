import React, { createContext, useContext, useState } from 'react';
import { apiLogin, apiRegister, setAuthToken, AuthUser } from '../api';

interface AuthCtx {
  user: AuthUser | null;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    setAuthToken(token);
    setUser(user);
  };
  const register = async (p: { firstName: string; lastName: string; email: string; password: string }) => {
    const { token, user } = await apiRegister(p);
    setAuthToken(token);
    setUser(user);
  };
  const logout = () => { setAuthToken(null); setUser(null); };

  return <Ctx.Provider value={{ user, isAuthed: !!user, login, register, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
};
