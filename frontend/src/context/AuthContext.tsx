import { createContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, fetchUser, logoutUser, registerUser } from "@/api/authApi";
import type { User } from "@/types/apiResponse";
import type { LoginPayload, RegisterPayload } from "@/types/apiPayloads";

type AuthContextType = {
  user: User | null;
  authLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await fetchUser();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    const data = await loginUser(payload);
    localStorage.setItem("token", data.key);

    const user = await fetchUser();
    setUser(user);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload);

    // Auto-login after register
    const loginPayload = {
      username: payload.username || payload.email,
      password: payload.password1,
    };

    const data = await loginUser(loginPayload);
    localStorage.setItem("token", data.key);

    const user = await fetchUser();
    setUser(user);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, logout, register, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
