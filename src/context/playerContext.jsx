import { createContext, useState } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [requiresParentAuth, setRequiresParentAuth] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

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

export { PlayerContext };
