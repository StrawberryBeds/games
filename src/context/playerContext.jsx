// context/playerContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext'; // Assuming you have this for currentUser

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [requiresParentAuth, setRequiresParentAuth] = useState(false);

  // Clear currentPlayer if user logs out
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

export const usePlayerSelection = () => useContext(PlayerContext);
