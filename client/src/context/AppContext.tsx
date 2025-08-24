import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

interface User {
  userId: string;
  name: string;
  email: string;
  currentStreak: number;
  maxStreak: number;
  totalTests: number;
  weeklyStreak: boolean[];
  totalPoints: number;
  currentPeriodPoints: number;
  daysUntilReset: number;
}

interface AppContextType {
  axios: typeof axios;
  navigate: ReturnType<typeof useNavigate>;
  token: string | null;
  setToken: (token: string | null) => void;
  input: string;
  setInput: (input: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  showUserLogin: boolean;
  setShowUserLogin: (show: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [input, setInput] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get("/api/users/is-auth", {
          headers: { Authorization: token },
        });
        if (data.success && data.user) {
          setUser(data.user);
          setToken(token);
          axios.defaults.headers.common["Authorization"] = token;
        }
      } catch (error: any) {
        console.error("Auth error", error.message);
      }
    };
    fetchUser();
  }, []);

  const value: AppContextType = {
    axios,
    navigate,
    token,
    setToken,
    input,
    setInput,
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
