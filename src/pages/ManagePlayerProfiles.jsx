// ManageProfilesPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PlayerTile from '../componentsShared/PlayerTile';
// import EditProfile from '../componentsProfilePage/EditProfile';

function ManageProfilesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedPlayer, setDisplayedPlayer] = useState([]);

  // Redirect if not logged in or no player selected
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

  const displayPlayerProfile = (player) => {
    setDisplayedPlayer(player);
  }

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="player-selector">
      <h2>Choose a profile to edit</h2>
      <div className="player-tiles">
        {familyPlayers.map((player) => (
          <PlayerTile
            key={player.id}
            player={player}
            onClick={() => displayPlayerProfile(player)}
            isDisplayedPlayer={displayedPlayer?.id === player.id}
          />
        ))}

        <div className='player-data'>
          <p>{displayedPlayer.givenName} {displayedPlayer.familyName}</p>

        </div>
      </div>
    </div>
  );
}

export default ManageProfilesPage;
