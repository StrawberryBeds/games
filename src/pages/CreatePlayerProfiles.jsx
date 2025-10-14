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


// Define avatars outside the component to avoid recreating on every render
const AVATARS = [
  {
    id: "balloon",
    name: "Balloon",
    image: "/assets/cardsets/emojis/balloon_1F388.svg",
  },
  {
    id: "cake",
    name: "Cake",
    image: "/assets/cardsets/emojis/cake_1F382.svg",
  },
  {
    id: "cat",
    name: "Cat",
    image: "/assets/cardsets/emojis/cat_1F431.svg",
  },
  {
    id: "dog",
    name: "Dog",
    image: "/assets/cardsets/emojis/dog_1F436.svg",
  },
  {
    id: "dragon",
    name: "Dragon",
    image: "/assets/cardsets/emojis/dragon_1F409.svg",
  },
  {
    id: "octopus",
    name: "Octopus",
    image: "/assets/cardsets/emojis/octopus_1F419.svg",
  },
  {
    id: "pheonix",
    name: "Phoenix",
    image: "/assets/cardsets/emojis/pheonix_1F426-200D-1F525.svg",
  },
  {
    id: "rofl",
    name: "ROFL",
    image: "/assets/cardsets/emojis/rofl_1F923.svg",
  },
  {
    id: "smiley",
    name: "Smiley",
    image: "/assets/cardsets/emojis/smiley_1F60A.svg",
  },
  {
    id: "unicorn",
    name: "Unicorn",
    image: "/assets/cardsets/emojis/unicorn_1F984.svg",
  },
];

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
            avatars={AVATARS}
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
              avatars={AVATARS}
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
