// context/usePlayerSelection.js
import { useContext } from 'react';
import { PlayerContext } from './playerContext';

export const usePlayerSelection = () => useContext(PlayerContext);
