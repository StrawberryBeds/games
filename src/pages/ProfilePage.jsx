// ProfilePage.jsx
// import { useState, useEffect } from 'react';
// import { usePlayerSelection } from '../context/usePlayerSelection';
// import { query, where, getDocs, collection, doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';

import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import FamilyProfiles from '../componentsProfilePage/FamilyProfiles';
import PlayerProfile from '../componentsProfilePage/PlayerProfile';

function ProfilePage() {
      const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

    return (
    <>
     {/* <FamilyProfiles></FamilyProfiles> */}
     <PlayerProfile></PlayerProfile>
    </>
  );
}

export default ProfilePage;