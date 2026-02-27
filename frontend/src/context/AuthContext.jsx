import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as logoutService } from "../services/auth.service";
import { getMyProfile } from "../services/profile.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const authRes = await getMe();
        if (!isMounted) return;

        const basicUser = authRes.data.user;

        if (basicUser && basicUser.id) {
          try {
            const profileRes = await getMyProfile(basicUser.id);
            if (!isMounted) return;

            const profileData = profileRes.data.data;

            setUser({
              ...basicUser,
              ...profileData,
            });
          } catch (profileError) {
            if (isMounted) setUser(basicUser);
          }
        } else {
          setUser(basicUser);
        }
      } catch (error) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};