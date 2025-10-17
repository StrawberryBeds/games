import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PlayerTile from '../componentsShared/PlayerTile';
import UserTile from '../componentsProfilePage/UserTile';
import NewPlayerTile from '../componentsProfilePage/NewPlayerTile';
import EditPlayer from '../componentsProfilePage/EditPlayer';
import EditUser from '../componentsProfilePage/EditUser';
import CreateChildPlayerProfile from "../componentsProfilePage/CreateChildPlayerProfiles";
import avatars from '../data/playerAvatars';

function ManageProfilesPage({ onComplete }) {
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
          throw new Error("Parent player profile not found!");
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
        setError("Failed to load family players. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFamilyPlayers();
  }, [currentUser]);

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
      setError("Failed to create child profile. Please try again.");
    }
  };

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='container'>
      <div className="player-selector">
        <h2>Change Profiles and Settings</h2>
        <div className="player-tiles">
          {familyPlayers.map((player) => (
            <PlayerTile
              key={player.id}
              player={player}
              onClick={() => setDisplayedPlayerProfile(player)}
              isDisplayed={displayedPlayerProfile?.id === player.id}
            />
          ))}
          <NewPlayerTile
            onClick={addChildProfile}
          />
          <UserTile
            key={currentUser.uid}
            currentUser={currentUser}
            onClick={() => setDisplayedUserDetails(currentUser)}
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
        <EditUser user={displayedUserDetails} />
      )}
    </div>
  );
}

export default ManageProfilesPage;
