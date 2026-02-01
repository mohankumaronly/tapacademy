import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import HomePageLayout from '../../layouts/HomepageLayout';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/auth/login', { replace: true });
  };

  return (
    <HomePageLayout>
      <>
        <h1 className="font-bold text-3xl">
          Welcome {`${user?.firstName} ${user?.lastName}`}
        </h1>

        <Button
          text="Logout"
          type="button"
          onClick={handleLogout}
        />
      </>
    </HomePageLayout>
  );
};

export default HomePage;