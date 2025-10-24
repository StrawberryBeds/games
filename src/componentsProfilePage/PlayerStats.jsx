// componentsProfilePage/PlayerStats.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./PlayerStats.css";

function PlayerStats({ player }) {
  const { t } = useTranslation();
  const scores = player?.scores || [];
  const navigate = useNavigate();
  const playerId = player.playerId;

  const calculateAverages = (scores) => {
    const statsByCardSet = {};
    scores.forEach(score => {
      if (!statsByCardSet[score.cardSet]) {
        statsByCardSet[score.cardSet] = [];
      }
      statsByCardSet[score.cardSet].push(score.turns);
    });

    return Object.entries(statsByCardSet).map(([cardSet, turns]) => {
      const personalBest = turns.length > 0 ? Math.min(...turns) : null;
      const avgFirstThree = turns.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(turns.length, 3);
      const avgLastThree = turns.slice(-3).reduce((a, b) => a + b, 0) / Math.min(turns.length, 3);
      const avgAll = turns.reduce((a, b) => a + b, 0) / turns.length;

      return {
        cardSet,
        personalBest,
        avgFirstThree,
        avgLastThree,
        avgAll,
        gameCount: turns.length,
      };
    });
  };

  const cardSetStats = calculateAverages(scores);

  if (scores.length === 0) {
    return <p>{t("playerStats.no_games")}</p>;
  }

  return (
    <div className="player-stats">
      <h3>{t("playerStats.player_stats", { playerName: player.playerName })}</h3>
      <table className="scores-table">
        <thead>
          <tr>
            <th>{t("playerStats.card_set")}</th>
            <th>{t("playerStats.personal_best")}</th>
            <th>{t("playerStats.avg_first_three")}</th>
            <th>{t("playerStats.avg_last_three")}</th>
            <th>{t("playerStats.avg_all")}</th>
            <th>{t("playerStats.game_count")}</th>
          </tr>
        </thead>
        <tbody>
          {cardSetStats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.cardSet}</td>
              <td>{stat.personalBest ? stat.personalBest.toFixed(0) : "N/A"}</td>
              <td>{stat.avgFirstThree?.toFixed(1)}</td>
              <td>{stat.avgLastThree?.toFixed(1)}</td>
              <td>{stat.avgAll?.toFixed(2)}</td>
              <td>{stat.gameCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerStats;
