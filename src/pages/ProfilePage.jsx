// src/pages/ProfilePage.jsx
import { useAuth } from '../context/authContext';

function ProfilePage() {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  return (
    <>
      <h1>Profile Page</h1>
    </>
  );
}

export default ProfilePage;