import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/authContext";
import { usePlayerSelection } from "../context/usePlayerSelection";
import { useNavigate } from "react-router-dom";
import { query, where, onSnapshot, collection, doc } from "firebase/firestore";
import { auth, db } from '../firebase';
import avatars from '../data/playerAvatars';
import PlayerTile from "../componentsShared/PlayerTile";

function ChoosePlayer() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { selectedPlayer, setSelectedPlayer, setRequiresParentAuth } = usePlayerSelection();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  // Fetch and listen for family players
  useEffect(() => {
    if (!currentUser) return;
    const parentPlayerRef = doc(db, "players", currentUser.uid);
    const unsubscribe = onSnapshot(parentPlayerRef, (parentSnap) => {
      if (!parentSnap.exists()) {
        navigate("/createprofile");
        return;
      }
      const familyId = parentSnap.data().familyId;
      if (!familyId) {
        setError(t("choosePlayer.error_family_id_not_found"));
        setLoading(false);
        return;
      }
      const playersQuery = query(
        collection(db, "players"),
        where("familyId", "==", familyId)
      );
      const unsubscribePlayers = onSnapshot(
        playersQuery,
        (snapshot) => {
          const players = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFamilyPlayers(players);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching players:", err);
          setError(t("choosePlayer.error_loading_players"));
          setLoading(false);
        }
      );
      return () => unsubscribePlayers();
    });
    return () => unsubscribe();
  }, [currentUser, navigate, t]);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    navigate("/");
  };

  // Show loading or error states
  if (loading) return <div className="player-selector">{t("loading")}</div>;
  if (error) return <div className="player-selector">{error}</div>;
  if (familyPlayers.length === 0) {
    return (
      <div className="player-selector">{t("choosePlayer.no_players_found")}</div>
    );
  }

  // Render player tiles
  return (
    <div className="player-selector">
      <h2>{t("choosePlayer.who_is_playing")}</h2>
      <div className="player-tiles">
        {familyPlayers.map((player) => (
          <PlayerTile
            key={player.id}
            player={player}
            onClick={() => handlePlayerSelect(player)}
            isSelected={selectedPlayer?.id === player.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ChoosePlayer;
