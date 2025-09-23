import React, {useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import CreateParentPlayerProfile from '../componentsProfilePage/CreateParentPlayerProfile';
import CreateChildPlayerProfile from '../componentsProfilePage/CreateChildPlayerProfiles';

// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

function CreateProfilesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  return (

    <div>
      <h2>{currentUser.uid}</h2>
      <h2>Create Your Parent Profile</h2>
      <CreateParentPlayerProfile></CreateParentPlayerProfile>
      <h2>Create Child Profiles</h2>

      <CreateChildPlayerProfile></CreateChildPlayerProfile>
      <CreateChildPlayerProfile></CreateChildPlayerProfile>
      <CreateChildPlayerProfile></CreateChildPlayerProfile>
      <CreateChildPlayerProfile></CreateChildPlayerProfile>

      <button onClick={() => navigate('/')}>Finish Profile Creation</button>

    </div>
  );
}

export default CreateProfilesPage;
