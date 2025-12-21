import { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  user: any | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const signIn = async (email: string, password: string) => {
    // Implement sign-in logic here
    setIsAuthenticated(true);
    setUser({ email });
  };

  const signOut = async () => {
    // Implement sign-out logic here
    setIsAuthenticated(false);
    setUser(null);
  };
  const signUp = async (email: string, password: string, username: string) => {
    // Implement sign-up logic here
    setIsAuthenticated(true);
    setUser({ email, username });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, signOut, signUp, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return value;
};
