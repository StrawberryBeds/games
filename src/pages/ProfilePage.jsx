// ProfilePage.jsx

import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import PlayerProfile from '../componentsProfilePage/PlayerProfile';


function ProfilePage() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  return (
    <>
      <PlayerProfile />
    </>
  );
}

export default ProfilePage;