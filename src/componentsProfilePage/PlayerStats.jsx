import React from 'react';
import "./PlayerStats.css";
import { auth, db } from '../firebase';


function PlayerStats({ player }) {
  // Safely handle cases where scores might be undefined
  const scores = player.scores || [];

  return (
    <div className="player-stats">
      <h3>{player.playerName}'s Game History</h3>

      {/* Check if there are scores to display */}
      {scores.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
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

      )}
    </div>
  );
}

export default PlayerStats;
