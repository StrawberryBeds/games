import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const { currentUser } = useAuth();
  const [requiresParentAuth, setRequiresParentAuth] = useState(false);

  // Initialize state from localStorage
  const [currentPlayer, _setCurrentPlayer] = useState(() => {
    const savedPlayer = localStorage.getItem('currentPlayer');
    return savedPlayer ? JSON.parse(savedPlayer) : null;
  });

  // Custom setter that updates both state and localStorage
  const setCurrentPlayer = (player) => {
    if (player) {
      localStorage.setItem('currentPlayer', JSON.stringify(player));
    } else {
      localStorage.removeItem('currentPlayer'); // Clear if null
    }
    _setCurrentPlayer(player); // Use the original setter (renamed to _setCurrentPlayer)
  };

  // Clear currentPlayer if user logs out
  useEffect(() => {
    if (!currentUser) {
      setCurrentPlayer(null); // Uses the custom setter
      setRequiresParentAuth(false);
    }
  }, [currentUser]);

  return (
    <PlayerContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,          // Custom setter
        requiresParentAuth,
        setRequiresParentAuth,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerSelection = () => useContext(PlayerContext);
