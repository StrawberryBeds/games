// ManageProfilesPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PlayerTile from '../componentsShared/PlayerTile';
import UserTile from '../componentsShared/UserTile';
import EditPlayer from '../componentsProfilePage/EditPlayer';
import EditUser from '../componentsProfilePage/EditUser';
import avatars from '../data/playerAvatars';

function ManageProfilesPage({ onComplete }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]);
  const [displayedPlayerProfile, setDisplayedPlayerProfile] = useState(null);
  const [displayedUserDetails, setDisplayedUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

{displayedUserDetails && (
  <EditUser user={displayedUserDetails} />
)}

    </div>
  );
}

export default ManageProfilesPage;
