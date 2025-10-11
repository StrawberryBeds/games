// componentsProfilePage/PlayerStats.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./PlayerStats.css";

function PlayerStats({ player }) {
  const scores = player?.scores || [];
  const navigate = useNavigate();
  const playerId = player.playerId;

  // Define the function before using it
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

  // Now you can safely call it
  const cardSetStats = calculateAverages(scores);

  if (scores.length === 0) {
    return <p>No games played yet.</p>;
  }

  return (
    <div className="player-stats">
      <h3>{player.playerName}'s Stats</h3>
      <table className="scores-table">
        <thead>
          <tr>
            <th>Card Set</th>
            <th>Personal Best</th>
            <th>Average Turns - first 3 games</th>
            <th>Average Turns - last 3 games</th>
            <th>Average Turns - all games</th>
            <th>Number of Games Played</th>
          </tr>
        </thead>
        <tbody>
          {cardSetStats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.cardSet}</td>
              <td>{stat.personalBest ? stat.personalBest.toFixed(0) : "N/A"}</td>
              <td>{stat.avgFirstThree?.toFixed(2)}</td>
              <td>{stat.avgLastThree?.toFixed(2)}</td>
              <td>{stat.avgAll?.toFixed(2)}</td>
              <td>{stat.gameCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/playerhistory')}>See All Stats</button>
    </div>
  );
}

export default PlayerStats;
