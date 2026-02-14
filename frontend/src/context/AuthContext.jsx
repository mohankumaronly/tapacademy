import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as logoutService } from "../services/auth.service";
import { getMyProfile } from "../services/profile.service"; 
  
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const authRes = await getMe();
      const basicUser = authRes.data.user;
      
      if (basicUser && basicUser.id) {
        try {
          const profileRes = await getMyProfile(basicUser.id);
          const profileData = profileRes.data.data;
          
          setUser({
            ...basicUser,
            ...profileData,
            avatarUrl: profileData?.avatarUrl || null,
            headline: profileData?.headline || '',
            location: profileData?.location || '',
            bio: profileData?.bio || '',
            skills: profileData?.skills || [],
            github: profileData?.github || '',
            linkedin: profileData?.linkedin || '',
            portfolio: profileData?.portfolio || '',
            education: profileData?.education || '',
            college: profileData?.college || '',
            batchName: profileData?.batchName || '',
            isProfilePublic: profileData?.isProfilePublic ?? true,
          });
        } catch (profileError) {
          console.error("Failed to fetch profile:", profileError);
          // If profile fetch fails, still set the basic user
          setUser(basicUser);
        }
      } else {
        setUser(basicUser);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear user state even if API fails
      setUser(null);
      // Clear any stored tokens
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout,
    checkUser
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