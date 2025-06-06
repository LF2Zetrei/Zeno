import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const expiry = await AsyncStorage.getItem("tokenExpiry");

      const now = Date.now();
      if (savedToken && expiry && now < parseInt(expiry)) {
        setToken(savedToken);
      } else {
        // token expiré
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("tokenExpiry");
        setToken(null);
      }
      setIsLoading(false);
    };

    loadToken();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (token) {
      timer = setTimeout(() => {
        logout();
      }, 10 * 60 * 1000); // 10 minutes
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token]);

  const login = async (newToken: string) => {
    const expiry = Date.now() + 10 * 60 * 1000; // maintenant + 10 min
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("tokenExpiry", expiry.toString());
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("tokenExpiry");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
