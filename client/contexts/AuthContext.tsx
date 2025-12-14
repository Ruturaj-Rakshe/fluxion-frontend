"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getProfile() ;
      if (response.user && Object.keys(response.user).length > 0) {
        setUser(response.user as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      // User not logged in or token expired
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.signin({ email, password });
    if(!response.user) return;
    if (response.user) {
      setUser(response.user as User);
    } else {
      setUser(null);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await authAPI.signup({ name, email, password });
    if (response.user) {
      setUser(response.user as User);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
