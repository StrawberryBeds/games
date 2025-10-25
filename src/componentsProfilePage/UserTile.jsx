// UserTile.jsx
import React from 'react';
import '../componentsShared/PlayerTile.css';
import settings from "/assets/hammer-and-wrench-1F6E0.svg";
import { useTranslation } from "react-i18next";

function UserTile({ user, onClick, isSelected }) {
   const imageSrc = settings
   const { t  } = useTranslation();

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
      <p className="player-name">{t('manageProfiles.settings')}</p>
      <span className="parent-badge">👨‍👧</span>
    </div>
  );
}

export default UserTile;