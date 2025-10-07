// src/components/ProfilePage/PlayerProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { usePlayerSelection } from "../context/usePlayerSelection";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebase';
import PlayerTile from "../componentsShared/PlayerTile";
import PlayerStats from "../componentsProfilePage/PlayerStats";

function PlayerProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { selectedPlayer, setRequiresParentAuth } = usePlayerSelection();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!selectedPlayer?.id) {
      setError("No player selected.");
      setLoading(false);
      return;
    }

    const playerRef = doc(db, "players", selectedPlayer.id);
    const unsubscribe = onSnapshot(
      playerRef,
      (playerSnap) => {
        console.log("Player profile updated:", playerSnap.data());
        if (!playerSnap.exists()) {
          setError("Player profile not found!");
          setLoading(false);
          return;
        }
        setPlayerProfile({ id: playerSnap.id, ...playerSnap.data() });
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [selectedPlayer?.id]);

  const handleEditProfiles = () => {
    if (!selectedPlayer) {
      alert("No player selected!");
      return;
    }
    if (selectedPlayer.isParent) {
      setRequiresParentAuth(true);
      navigate("/parent-auth");
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
          onClick={() => handleEditProfiles()}
          isSelected={selectedPlayer?.id === selectedPlayer.id}
        />
      </div>
      <div>
        <PlayerStats
          key={selectedPlayer.id}
          player={playerProfile} // Use playerProfile instead of selectedPlayer
          isSelected={selectedPlayer?.id === selectedPlayer.id}
        />
      </div>
    </div>
  );
}

export default PlayerProfile;
