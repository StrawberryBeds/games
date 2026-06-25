// componentsProfilePage/FamilyLeaderboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./PlayerStats.css";

function FamilyLeaderboard({ familyId, player }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [familyPlayers, setFamilyPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scores = player?.scores || [];
      const cardSet = player?.cardSet || {};

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
                navigate("/auth/createprofile");
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
                    try {
                        const players = snapshot.docs.map((doc) => {
                            const playerData = doc.data();
                            // Extract all turns from the scores array
                            const turns = playerData.scores
                                ? playerData.scores.map((score) => score.turns).filter(Boolean)
                                : [];
                            const personalBest = turns.length > 0 ? Math.min(...turns) : null;
                            const gameCount = turns.length;
                            return {
                                id: doc.id,
                                ...playerData,
                                personalBest,
                                gameCount,
                            };
                        });
                        console.log("Fetched players", players);
                        setFamilyPlayers(players);
                    } catch (err) {
                        console.error("Error calculating player stats:", err);
                        setError(t("choosePlayer.error_loading_players"));
                    } finally {
                        setLoading(false);
                    }
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

const calculateAverages = (players) => {
  return players.map((player) => {
    const scores = player.scores || [];
    if (scores.length === 0) {
      return {
        id: player.id,
        playerName: player.playerName,
        personalBest: null,
        bestCardSet: "N/A",
        avgAll: null,
        gameCount: 0,
      };
    }

    // Find the score object with the minimum turns
    const bestScore = scores.reduce(
      (best, score) => (score.turns < best.turns ? score : best),
      scores[0]
    );

    const turns = scores.map((score) => score.turns).filter(Boolean);
    const avgAll = turns.length > 0 ? turns.reduce((a, b) => a + b, 0) / turns.length : null;

    return {
      id: player.id,
      playerName: player.playerName,
      personalBest: bestScore.turns,
      bestCardSet: bestScore.cardSet || "N/A",
      avgAll,
      gameCount: turns.length,
    };
  });
};


    const familyStats = calculateAverages(familyPlayers);



    return (
        <div className="family-leaderboard">
            <h3>{t("familyLeaderboard.family_leaderboard")}</h3>
            <table className="scores-table">
                <thead>
                    <tr>
                        <th>{t('playerStats.player_name')}</th>
                        <th>{t("playerStats.personal_best")}</th>
                        <th>{t("playerStats.avg_all")}</th>
                        <th>{t("playerStats.game_count")}</th>
                    </tr>
                </thead>
<tbody>
  {familyStats.map((stat) => (
    <tr key={stat.id} onClick={() => navigate(`/profile/${stat.id}`)}>
      <td>{stat.playerName}</td>
      <td>
  {stat.personalBest !== null
    ? `${stat.personalBest} (${t(`card_sets.${stat.bestCardSet}`)})`
    : "N/A"}
</td>
      <td>{stat.avgAll ? stat.avgAll.toFixed(2) : "N/A"}</td>
      <td>{stat.gameCount}</td>
    </tr>
  ))}
</tbody>

            </table>
        </div>
    );
}

export default FamilyLeaderboard;