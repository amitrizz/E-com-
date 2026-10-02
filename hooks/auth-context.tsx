"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/types/auth";

const TOKEN_KEY = "kashu-auth-token";

type Status = "loading" | "authenticated" | "anonymous";

type AuthResult = { error?: string; user?: AuthUser };

const AuthContext = createContext<{
  user: AuthUser | null;
  status: Status;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    marketingOptIn?: boolean;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
} | null>(null);

function persistSession(data: { token: string; user: AuthUser }) {
  localStorage.setItem(TOKEN_KEY, data.token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(TOKEN_KEY);
    } catch {
      setStatus("anonymous");
      return;
    }
    if (!stored) {
      setStatus("anonymous");
      return;
    }
    fetch("/api/auth/session", { headers: { Authorization: `Bearer ${stored}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setToken(stored);
          setStatus("authenticated");
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setStatus("anonymous");
        }
      })
      .catch(() => setStatus("anonymous"));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: (data.error as string) ?? "Login failed" };
    persistSession(data);
    setToken(data.token);
    setUser(data.user);
    setStatus("authenticated");
    return { user: data.user };
  }, []);

  const signup = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      marketingOptIn?: boolean;
    }): Promise<AuthResult> => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) return { error: (data.error as string) ?? "Signup failed" };
      persistSession(data);
      setToken(data.token);
      setUser(data.user);
      setStatus("authenticated");
      return { user: data.user };
    },
    []
  );

  const logout = useCallback(async () => {
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus("anonymous");
  }, [token]);

  const value = useMemo(
    () => ({ user, status, token, login, signup, logout }),
    [user, status, token, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
