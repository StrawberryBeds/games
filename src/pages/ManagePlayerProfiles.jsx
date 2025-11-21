import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PlayerTile from '../componentsShared/PlayerTile';
import UserTile from '../componentsProfilePage/UserTile';
import NewPlayerTile from '../componentsProfilePage/NewPlayerTile';
import EditPlayer from '../componentsProfilePage/EditPlayer';
import UserSettings from '../componentsProfilePage/UserSettings';
import CreateChildPlayerProfile from "../componentsProfilePage/CreateChildPlayerProfiles";
import avatars from '../data/playerAvatars';

function ManageProfilesPage({ onComplete }) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]);
  const [displayedPlayerProfile, setDisplayedPlayerProfile] = useState(null);
  const [displayedUserDetails, setDisplayedUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childProfiles, setChildProfiles] = useState([]);
  const [displayedChildForm, setDisplayedChildForm] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Fetch family players
  useEffect(() => {
    const fetchFamilyPlayers = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const parentPlayerRef = doc(db, 'players', currentUser.uid);
        const parentPlayerSnap = await getDoc(parentPlayerRef);
        if (!parentPlayerSnap.exists()) {
          throw new Error(t("manageProfiles.parent_not_found"));
        }
        const parentPlayerData = parentPlayerSnap.data();
        const familyId = parentPlayerData.familyId;
        const playersQuery = query(
          collection(db, 'players'),
          where('familyId', '==', familyId)
        );
        const querySnapshot = await getDocs(playersQuery);
        const players = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFamilyPlayers(players);
      } catch (err) {
        console.error("Error fetching family players:", err);
        setError(t("manageProfiles.error_fetching_family_players"));
      } finally {
        setLoading(false);
      }
    };
    fetchFamilyPlayers();
  }, [currentUser, t]);

  const addChildProfile = () => {
    const newChildProfiles = [...childProfiles, { id: Date.now() }];
    setChildProfiles(newChildProfiles);
    setDisplayedChildForm(true);
    setDisplayedPlayerProfile(null);
    setDisplayedUserDetails(null);
  };

  const handleChildProfileCreated = async (childProfileData) => {
    try {
      const parentPlayerRef = doc(db, 'players', currentUser.uid);
      const parentPlayerSnap = await getDoc(parentPlayerRef);
      const parentPlayerData = parentPlayerSnap.data();
      const familyId = parentPlayerData.familyId;

      // Create the new child player in Firestore
      const newChildPlayerRef = doc(collection(db, 'players'));
      await setDoc(newChildPlayerRef, {
        ...childProfileData,
        familyId,
        isParent: false,
        isParentPlayer: false,
      });

      // Update the parent's childPlayers array
      await updateDoc(parentPlayerRef, {
        childPlayers: [...(parentPlayerData.childPlayers || []), newChildPlayerRef.id]
      });

      // Refresh the family players list
      const playersQuery = query(
        collection(db, 'players'),
        where('familyId', '==', familyId)
      );
      const querySnapshot = await getDocs(playersQuery);
      const players = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFamilyPlayers(players);
      setDisplayedChildForm(false);
    } catch (err) {
      console.error("Error creating child profile:", err);
      setError(t("manageProfiles.error_create_child_profile"));
    }
  };

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;

  return (
    // PROFILES AND SETTINGS SELECTION

    <div className='container'>
      <div className="player-selector">
        <h2>{t("manageProfiles.my_profiles_and_settings")}</h2>
        <div className="player-tiles">
          {familyPlayers.map((player) => (
            <PlayerTile
              key={player.id}
              player={player}
              onClick={() => {
                setDisplayedPlayerProfile(player);
                setDisplayedUserDetails(null);   // Reset user details
                setDisplayedChildForm(false);    // Reset child form
              }}
              isDisplayed={displayedPlayerProfile?.id === player.id}
            />
          ))}
          <NewPlayerTile
            onClick={() => {
              setDisplayedPlayerProfile(null);
              setDisplayedUserDetails(null);
              addChildProfile(true)
            }}
          />
          <UserTile
            key={currentUser.uid}
            currentUser={currentUser}
            onClick={() => {
              setDisplayedUserDetails(currentUser);
              setDisplayedPlayerProfile(null); // Reset player profile
              setDisplayedChildForm(false);    // Reset child form
            }}
            isDisplayed={displayedUserDetails?.uid === currentUser.uid}
          />
        </div>
      </div>
      {displayedPlayerProfile && (
        <EditPlayer
          player={displayedPlayerProfile}
          avatars={avatars}
        />
      )}
      {displayedChildForm && childProfiles.length > 0 && (
        <CreateChildPlayerProfile
          key={childProfiles[childProfiles.length - 1].id}
          profileId={childProfiles[childProfiles.length - 1].id}
          avatars={avatars}
          onComplete={handleChildProfileCreated}
        />
      )}
      {displayedUserDetails && (
        <UserSettings user={displayedUserDetails} />
      )}
    </div>
  );
}

export default ManageProfilesPage;
