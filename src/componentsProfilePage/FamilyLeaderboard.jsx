// componentsProfilePage/FamilyLeaderboard.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from '../firebase';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./PlayerStats.css";

function FamilyLeaderboard({ familyId, players }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
     const { currentUser } = useAuth();
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
                    {familyPlayers.map((player) => (
                        <tr key={player.playerId} onClick={() => navigate(`/profile/${player.playerId}`)}>
                            <td>{player.playerName}</td>
                            <td>{player.personalBest}</td>
                            <td>{player.gameCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FamilyLeaderboard;