// NewPlayerTile.jsx
import '../componentsShared/PlayerTile.css';
import parentAndChild from "/assets/parent-and-child.svg";
import { useTranslation } from 'react-i18next';

function NewPlayerTile({ user, onClick, isSelected }) {
   const imageSrc = parentAndChild
   const { t  } = useTranslation();

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
      <p className="player-name">{t('manageProfiles.add_child')}</p>
      <span className="parent-badge">👨‍👧</span>
    </div>
  );
}

export default NewPlayerTile;