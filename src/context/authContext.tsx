import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: any }>;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ success: boolean; user?: User; error?: any }>;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      setIsAuthenticated(true);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const user = await signUpWithEmail(email, password, username);
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
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
