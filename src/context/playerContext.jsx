// context/playerContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

export const PlayerContext = createContext(); // Export the context itself

export function PlayerProvider({ children }) {
  const { currentUser } = useAuth();
  const [requiresParentAuth, setRequiresParentAuth] = useState(false);
  const [currentPlayer, _setCurrentPlayer] = useState(() => {
    const savedPlayer = localStorage.getItem('currentPlayer');
    return savedPlayer ? JSON.parse(savedPlayer) : null;
  });

  const setCurrentPlayer = (player) => {
    if (player) {
      localStorage.setItem('currentPlayer', JSON.stringify(player));
    } else {
      localStorage.removeItem('currentPlayer');
    }
    _setCurrentPlayer(player);
  };

  useEffect(() => {
    if (!currentUser) {
      setCurrentPlayer(null);
      setRequiresParentAuth(false);
    }
  }, [currentUser]);

  return (
    <PlayerContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,
        requiresParentAuth,
        setRequiresParentAuth,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
