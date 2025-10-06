import React from 'react';
import './PlayerTile.css';

function PlayerTile({ player, onClick, isSelected }) {
  // Map avatar IDs to image paths
  const avatarImages = {
    balloon: "/assets/cardsets/emojis/balloon_1F388.svg",
    cake: "/assets/cardsets/emojis/cake_1F382.svg",
    cat: "/assets/cardsets/emojis/cat_1F431.svg",
    dog: "/assets/cardsets/emojis/dog_1F436.svg",
    dragon: "/assets/cardsets/emojis/dragon_1F409.svg",
    octopus: "/assets/cardsets/emojis/octopus_1F419.svg",
    pheonix: "/assets/cardsets/emojis/pheonix_1F426-200D-1F525.svg",
    rofl: "/assets/cardsets/emojis/rofl_1F923.svg",
    smiley: "/assets/cardsets/emojis/smiley_1F60A.svg",
    unicorn: "/assets/cardsets/emojis/unicorn_1F984.svg"
  };

  // Get the correct image path based on the player's avatar
  const imageSrc = avatarImages[player.playerAvatar] || "/assets/default-avatar.svg";

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
