// src/pages/CreatePlayerProfiles.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import CreateParentPlayerProfile from "../componentsProfilePage/CreateParentPlayerProfile";
import CreateChildPlayerProfile from "../componentsProfilePage/CreateChildPlayerProfiles";
import "../componentsProfilePage/CreatePlayerProfiles.css"
import avatars from '../data/playerAvatars';

function CreateProfilesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [childProfiles, setChildProfiles] = useState([]);
  const [parentComplete, setParentComplete] = useState(false);
  const [displayedParentForm, setDisplayedParentForm] = useState(true);
  const [displayedChildForm, setDisplayedChildForm] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  // Add initial child profile if none exist
  useEffect(() => {
    if (childProfiles.length === 0) {
      addChildProfile();
    }
  }, []);

  const addChildProfile = () => {
    setChildProfiles([...childProfiles, { id: Date.now() }]);
  };

  const handleFinish = async () => {
    try {
      await updateDoc(doc(db, "players", currentUser.uid), {
        setupComplete: true,
      });

      // Wait for the update to complete
      await new Promise((resolve) => {
        const unsubscribe = onSnapshot(
          doc(db, "players", currentUser.uid),
          (docSnapshot) => {
            if (docSnapshot.data()?.setupComplete) {
              resolve();
              unsubscribe();
            }
          }
        );
      });

      navigate("/player");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="profile-creation-container">
      <h2>Create Your Family Profiles</h2>

      {/* Parent Profile Section */}

      <div className="parent-profile-section">
        {displayedParentForm && (
          <CreateParentPlayerProfile
            avatars={avatars}
            onComplete={() => [setParentComplete(true), setDisplayedParentForm(false)]}
          />
        )}
      </div>

      {/* Child Profiles Section */}
      <div className="child-profiles-section">
        {childProfiles.map((profile, index) => (
          displayedChildForm && index === childProfiles.length - 1 && (
            <CreateChildPlayerProfile
              key={profile.id}
              profileId={profile.id}
              avatars={avatars}
            />
          )
        ))}
      </div>

      <button
        onClick={() => {
          addChildProfile();
          setDisplayedChildForm(true);
        }}
        className="add-child-button"
      >
        Add A Child Profile
      </button>


      {/* Finish Button */}
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
