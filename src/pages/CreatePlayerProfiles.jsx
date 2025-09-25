// src/pages/CreatePlayerProfiles.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { usePlayerSelection } from '../context/usePlayerSelection';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { onSnapshot } from 'firebase/firestore'; 
import CreateParentPlayerProfile from '../componentsProfilePage/CreateParentPlayerProfile';
import CreateChildPlayerProfile from '../componentsProfilePage/CreateChildPlayerProfiles';

function CreateProfilesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [childProfiles, setChildProfiles] = useState([{id: 1}]);
  const [parentComplete, setParentComplete] = useState(false);
    const { currentPlayer } = usePlayerSelection();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  console.log("CreatePlayerProfiles:", currentPlayer)

const handleFinish = async () => {
  try {
    await updateDoc(doc(db, "players", currentUser.uid), {
      setupComplete: true,
    });

    // Wait for the local context to update (e.g., via onSnapshot)
    await new Promise((resolve) => {
      const unsubscribe = onSnapshot(
        doc(db, "players", currentUser.uid),
        (doc) => {
          if (doc.data()?.setupComplete) {
            resolve();
            unsubscribe();
          }
        }
      );
    });

    navigate('/player'); // Now safe to navigate
  } catch (error) {
    console.error("Error:", error);
  }
};


    return (
    <div className="profile-creation-container">
      <h2>Create Your Family Profiles</h2>
      <h2>{currentUser.uid}</h2>

      <div className="parent-profile-section">
        <h3>Parent Profile</h3>
        <CreateParentPlayerProfile onComplete={() => setParentComplete(true)} />
      </div>

      <div className="child-profiles-section">
        <h3>Child Profiles</h3>
        {childProfiles.map(profile => (
          <CreateChildPlayerProfile
            key={profile.id}
            profileId={profile.id}
          />
        ))}

        <button
          onClick={() => setChildProfiles([...childProfiles, {id: childProfiles.length + 1}])}
          className="add-child-button"
        >
          Add Another Child
        </button>
      </div>

      <button
        onClick={handleFinish}
        disabled={!parentComplete}
        className="finish-button"
      >
        Finish Profile Creation
      </button>
    </div>
  );
}

export default CreateProfilesPage;
