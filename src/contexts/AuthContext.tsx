import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, location: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await authService.signIn({ email, password });
    const userData = await authService.getMe();
    setUser(userData);
  };

  const signUp = async (name: string, email: string, password: string, location: string) => {
    const response = await authService.signUp({ name, email, password, location });
    const userData = await authService.getMe();
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
