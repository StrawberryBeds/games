// src/components/ProfilePage/PlayerProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { usePlayerSelection } from "../context/usePlayerSelection";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PlayerTile from '../componentsShared/PlayerTile'

function PlayerProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  // Destructure to get the actual player object
  const { selectedPlayer, setRequiresParentAuth } = usePlayerSelection();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Current player in PlayerProfile:", selectedPlayer); // Now logs the player object

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      if (!selectedPlayer?.id) {
        setError("No player selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const playerRef = doc(db, 'players', selectedPlayer.id);
        const playerSnap = await getDoc(playerRef);

        if (!playerSnap.exists()) {
          throw new Error("Player profile not found!");
        }

        setPlayerProfile({ id: playerSnap.id, ...playerSnap.data() });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [selectedPlayer?.id]); // Re-run when player ID changes

    // Handle "Edit Profiles" button click
  const handleEditProfiles = () => {
    if (!selectedPlayer) {
      alert("No player selected!");
      return;
    }
    if (selectedPlayer.isParent) {
      setRequiresParentAuth(true); // Trigger parent auth
      navigate('/parent-auth');    // Redirect to password prompt
    } else {
      alert("Only parents can manage profiles.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!playerProfile) return <div>No player profile found.</div>;

  return (
    <div className="profile-page">
      <h2>{playerProfile.playerName}'s Profile</h2>
      <div className="player-tile">
        <PlayerTile
            key={selectedPlayer.id}
            player={selectedPlayer}
            isSelected={selectedPlayer?.id === selectedPlayer.id}
          />
      </div>
            <button onClick={handleEditProfiles}>View Family Profiles - Parents Only</button>
    </div>
  );
}

export default PlayerProfile;
