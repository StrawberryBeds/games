// context/playerContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const { currentUser } = useAuth();
  const [requiresParentAuth, setRequiresParentAuth] = useState(false);
  const [selectedPlayer, _setSelectedPlayer] = useState(() => {
    try {
      const savedPlayer = localStorage.getItem('selectedPlayer');
      return savedPlayer ? JSON.parse(savedPlayer) : null;
    } catch (e) {
      console.error("Failed to parse selectedPlayer from localStorage", e);
      return null;
    }
  });

  const setSelectedPlayer = (player) => {
    if (player) {
      localStorage.setItem('selectedPlayer', JSON.stringify(player));
    } else {
      localStorage.removeItem('selectedPlayer');
    }
    _setSelectedPlayer(player);
  };

  useEffect(() => {
    if (!currentUser) {
      setSelectedPlayer(null);
      setRequiresParentAuth(false);
    }
  }, [currentUser]);

  return (
    <PlayerContext.Provider
      value={{
        selectedPlayer,
        setSelectedPlayer,
        requiresParentAuth,
        setRequiresParentAuth,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export { PlayerContext }; // Named export
