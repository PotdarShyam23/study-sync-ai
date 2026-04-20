import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentSession,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getCurrentSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login: async (credentials) => {
        const nextUser = await loginUser(credentials);
        setUser(nextUser);
        return nextUser;
      },
      signup: async (payload) => {
        const nextUser = await registerUser(payload);
        setUser(nextUser);
        return nextUser;
      },
      logout: async () => {
        await logoutUser();
        setUser(null);
      },
      saveProfile: async (payload) => {
        const nextUser = await updateUserProfile(payload);
        setUser(nextUser);
        return nextUser;
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
