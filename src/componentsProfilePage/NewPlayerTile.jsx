// NewPlayerTile.jsx
import React from 'react';
import '../componentsShared/PlayerTile.css';
import parentAndChild from "/assets/parent-and-child.svg";
// import avatars from '../data/playerAvatars';

function NewPlayerTile({ user, onClick, isSelected }) {
  // Get the avatar object by name
//   const avatar = avatars[player.playerAvatar];
  // Use the avatar's image, or a default if not found
   const imageSrc = parentAndChild

  return (
    <div
      className={`player-tile ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(user)}
      role="button"
      tabIndex="0"
      aria-label={`Add a child`}
    >
      <div className="player-avatar">
        <img
          src={imageSrc}
          alt={`Add a Child`}
          width="80"
          height="80"
        />
      </div>
      <p className="player-name">Add A Child</p>
      <span className="parent-badge">👨‍👧</span>
    </div>
  );
}

export default NewPlayerTile;