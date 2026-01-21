import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: "active" | "inactive" | "canceled" | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateSubscriptionStatus: (status: User["subscriptionStatus"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "haste_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const signIn = async (email: string, password: string): Promise<void> => {
    // For demo purposes, accept any valid email/password format
    // In production, this would call an authentication API
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user exists in localStorage (from previous sign-up)
    const existingUsers = localStorage.getItem("haste_users");
    let userData: User | null = null;

    if (existingUsers) {
      const users = JSON.parse(existingUsers);
      const existingUser = users.find((u: User) => u.email === email);
      if (existingUser) {
        userData = existingUser;
      }
    }

    // If no existing user found, create a basic one for demo
    if (!userData) {
      userData = {
        id: crypto.randomUUID(),
        email,
        name: email.split("@")[0],
        subscriptionStatus: null,
      };
    }

    setUser(userData);
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      subscriptionStatus: null,
    };

    // Store in users list for future sign-ins
    const existingUsers = localStorage.getItem("haste_users");
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    users.push(newUser);
    localStorage.setItem("haste_users", JSON.stringify(users));

    setUser(newUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const updateSubscriptionStatus = (status: User["subscriptionStatus"]) => {
    if (user) {
      const updatedUser = { ...user, subscriptionStatus: status };
      setUser(updatedUser);

      // Also update in users list
      const existingUsers = localStorage.getItem("haste_users");
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const index = users.findIndex((u: User) => u.id === user.id);
        if (index !== -1) {
          users[index] = updatedUser;
          localStorage.setItem("haste_users", JSON.stringify(users));
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
