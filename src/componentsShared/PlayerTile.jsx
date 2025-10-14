// PlayerTile.jsx
import React from 'react';
import './PlayerTile.css';
import avatars from '../data/playerAvatars';

function PlayerTile({ player, onClick, isSelected }) {
  // Get the avatar object by name
  const avatar = avatars[player.playerAvatar];
  // Use the avatar's image, or a default if not found
  const imageSrc = avatar ? avatar.image : "/assets/default-avatar.svg";

  return (
    <div
      className={`player-tile ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(player)}
      role="button"
      tabIndex="0"
      aria-label={`Select ${player.playerName}`}
    >
      <div className="player-avatar">
        <img
          src={imageSrc}
          alt={`${player.playerName}'s avatar`}
          width="80"
          height="80"
        />
      </div>
      <p className="player-name">{player.playerName}</p>
      {player.isParentPlayer && <span className="parent-badge">👨‍👧</span>}
    </div>
  );
}

export default PlayerTile;
