/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, logout } from "../services/auth.services";

interface User {
  userId: number;
  username: string;
  accessToken: string;
}
type AuthContextType = {
  user: User | null;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(getCurrentUser());

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
