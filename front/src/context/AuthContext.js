'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, setUser, removeUser } from '../lib/token';
import { loginApi, logoutApi } from '../lib/api/auth.api';
import { getProfileByUsernameApi } from '../lib/api/users.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    if (stored) {
      setUserState(stored);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (handle, password) => {
    const userInfo = await loginApi(handle, password);
    if (!userInfo.profileId) {
      const profile = await getProfileByUsernameApi(userInfo.username).catch(() => null);
      userInfo.profileId = profile?.id ?? null;
    }
    setUser(userInfo);
    setUserState(userInfo);
    return userInfo;
  }, []);

  const logout = useCallback(() => {
    removeUser();
    setUserState(null);
    logoutApi().catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
