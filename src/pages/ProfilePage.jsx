// ProfilePage.jsx

import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import FamilyProfiles from '../componentsProfilePage/FamilyProfiles';
import PlayerProfile from '../componentsProfilePage/PlayerProfile';
import { auth, db } from '../firebase';


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