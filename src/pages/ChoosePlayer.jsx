import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { usePlayerSelection } from '../context/playerContext';
import { useNavigate } from 'react-router-dom';
import { query, where, onSnapshot, collection, doc } from 'firebase/firestore';
import { db } from '../firebase';

function ChoosePlayer() {
  const { currentUser } = useAuth();
  const { currentPlayer, setCurrentPlayer } = usePlayerSelection();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]); // State to store fetched players
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

   // Fetch and listen for family players
  useEffect(() => {
    if (!currentUser) return;
    const parentPlayerRef = doc(db, 'players', currentUser.uid);
    const unsubscribe = onSnapshot(parentPlayerRef, (parentSnap) => {
      if (!parentSnap.exists()) {
        navigate('/createprofile');
        return;
      }
      const familyId = parentSnap.data().familyId;
      if (!familyId) {
        setError("Family ID not found. Please set up your family profile.");
        setLoading(false);
        return;
      }
      const playersQuery = query(
        collection(db, 'players'),
        where('familyId', '==', familyId)
      );
      const unsubscribePlayers = onSnapshot(
        playersQuery,
        (snapshot) => {
          const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFamilyPlayers(players);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching players:", err);
          setError("Failed to load players. Please refresh.");
          setLoading(false);
        }
      );
      return () => unsubscribePlayers();
    });
    return () => unsubscribe();
  }, [currentUser, navigate]);

  // TO DO : Revise this so remove select player without requiresParentAuth
  const handlePlayerSelect = (player) => {
    setCurrentPlayer(player);
    // if (player.isParent) {
    //   setRequiresParentAuth(true); // Trigger password prompt
    //   navigate('/');
    // } else {
      console.log("Current User:", currentUser)
      console.log("Current Player:", player)
      navigate('/'); // Redirect to home for children
    // }
  };

  // Show loading or error states
  if (loading) return <div className="player-selector">Loading players...</div>;
  if (error) return <div className="player-selector">{error}</div>;
  if (familyPlayers.length === 0) {
    return <div className="player-selector">No players found. Create a profile?</div>;
  }

  // Render player tiles
    return (
    <div className="player-selector">
      <h2>Who's Playing?</h2>
      <div className="player-tiles">
        {familyPlayers.map((player) => (
          <button
            key={player.id}
            onClick={() => handlePlayerSelect(player)}
            className={`player-tile ${currentPlayer?.id === player.id ? 'selected' : ''}`}
          >
            {player.playerName} {player.isParent && '👑'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChoosePlayer;