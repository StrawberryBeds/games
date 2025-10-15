// UserTile.jsx
import React from 'react';
import '../componentsShared/PlayerTile.css';
import settings from "/assets/hammer-and-wrench-1F6E0.svg";
// import avatars from '../data/playerAvatars';

function UserTile({ user, onClick, isSelected }) {
  // Get the avatar object by name
//   const avatar = avatars[player.playerAvatar];
  // Use the avatar's image, or a default if not found
   const imageSrc = settings

  return (
    <div
      className={`player-tile ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(user)}
      role="button"
      tabIndex="0"
      aria-label={`Select to edit parent settings`}
    >
      <div className="player-avatar">
        <img
          src={imageSrc}
          alt={`Settings`}
          width="80"
          height="80"
        />
      </div>
      <p className="player-name">Settings</p>
      <span className="parent-badge">👨‍👧</span>
    </div>
  );
}

export default UserTile;