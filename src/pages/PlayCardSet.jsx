// src/pages/PlayCardSet.jsx
import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import GameBoard from "../componentsPlayCardSet/GameBoard";
import cardSets from "../data/cardSets"; 

function PlayCardSet({ isGuest = false }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Redirect if not a guest and not logged in
  if (!isGuest && !currentUser) {
    navigate("/home");
    return null;
  }

    const selectedSet = cardSets.find((set) => set.id === id);
  if (!selectedSet) {
    return defaultSet = set.id === "0";
  }

  // Pass the selected set's Cards to GameBoard
  return (
    <GameBoard
      cards={selectedSet.Cards}
      cardSetName={selectedSet.name}
      isGuest={isGuest}
    />
  );
}

export default PlayCardSet;
