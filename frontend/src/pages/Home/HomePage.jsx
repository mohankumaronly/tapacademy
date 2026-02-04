import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import HomePageLayout from "../../layouts/HomepageLayout";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/auth/login", { replace: true });
  };

  return (
    <HomePageLayout>
      <h1 className="font-bold text-3xl mb-6">
        Welcome{" "}
        <span className="text-gray-700">
          {user ? `${user.firstName} ${user.lastName}` : ""}
        </span>
      </h1>

      <div className="flex gap-4 flex-wrap">
        <Button
          text="Profile"
          type="button"
          onClick={() => navigate("/home/profile")}
        />

        <Button
          text="Explore Profiles"
          type="button"
          onClick={() => navigate("/home/public-profiles")}
        />

         <Button
          text="Create Post"
          type="button"
          onClick={() => navigate("/home/create-post")}
        />
         <Button
          text="feeds"
          type="button"
          onClick={() => navigate("/home/feed")}
        />

        <Button
          text="Logout"
          type="button"
          onClick={handleLogout}
        />
        
      </div>
    </HomePageLayout>
  );
};

export default HomePage;
