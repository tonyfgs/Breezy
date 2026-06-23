'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, removeToken, decodeToken } from '../lib/token';
import { loginApi } from '../lib/api/auth.api';
import { getProfileByUsernameApi } from '../lib/api/users.api';

const AuthContext = createContext(null);

async function buildUser(decoded) {
  const profile = await getProfileByUsernameApi(decoded.username).catch(() => null);
  return { ...decoded, profileId: profile?.id ?? null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        buildUser(decoded)
          .then(setUser)
          .catch(() => setUser(decoded))
          .finally(() => setLoading(false));
      } else {
        removeToken();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (handle, password) => {
    const { token } = await loginApi(handle, password);
    setToken(token);
    const decoded = decodeToken(token);
    const enriched = await buildUser(decoded).catch(() => decoded);
    setUser(enriched);
    return enriched;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
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
