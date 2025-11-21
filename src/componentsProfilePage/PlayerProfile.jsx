// src/components/ProfilePage/PlayerProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { useTranslation } from "react-i18next";
import { usePlayerSelection } from "../context/usePlayerSelection";
import PlayerTile from "../componentsShared/PlayerTile";
import PlayerStats from "../componentsProfilePage/PlayerStats";
import FamilyLeaderboard from "./FamilyLeaderboard";

function PlayerProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { selectedPlayer, setRequiresParentAuth } = usePlayerSelection();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!selectedPlayer?.id) {
      setError(t("no_player_selected"));
      setLoading(false);
      return;
    }

    const playerRef = doc(db, "players", selectedPlayer.id);
    const unsubscribe = onSnapshot(
      playerRef,
      (playerSnap) => {
        if (!playerSnap.exists()) {
          setError(t("player_not_found"))
          setLoading(false);
          return;
        }
        setPlayerProfile({ id: playerSnap.id, ...playerSnap.data() });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [selectedPlayer?.id]);

  const handleEditProfiles = () => {
    if (!selectedPlayer) {
      alert(t("no_player_selected"))
      return;
    }
    if (selectedPlayer.isParent) {
      setRequiresParentAuth(true);
      navigate("/auth/parent-auth");
    } else {
      alert(t('manageProfiles.only_parents_can_manage_profiles'));
    }
  };

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;
  if (!playerProfile) return <div>{t("player_not_found")}</div>;

  return (
    <div className="profile-page">
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
      <div>
        <FamilyLeaderboard
        key ={selectedPlayer.id}
          family={playerProfile.familyId}
          isSelected={selectedPlayer?.id === selectedPlayer.id}
        />
      </div>
    </div>
  );
}

export default PlayerProfile;
