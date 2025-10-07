// componentsProfilePage/PlayerStats.jsx
import React from 'react';
import "./PlayerStats.css";

function PlayerStats({ player }) {
  const scores = player?.scores || [];

  if (scores.length === 0) {
    return <p>No games played yet.</p>;
  }

  return (
    <div className="player-stats">
      <h3>{player.playerName}'s Game History</h3>
      <table className="scores-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Card Set</th>
            <th>Turns</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((scoreEntry, index) => (
            <tr key={index}>
              <td>{new Date(scoreEntry.date).toLocaleDateString()}</td>
              <td>{scoreEntry.cardSet}</td>
              <td>{scoreEntry.turns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerStats;
