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

  // Find the card set by id, with fallback to first set for guests
  const selectedSet = cardSets.find((set) => set.id === id) || cardSets[0];

  // If still no set (shouldn't happen, but just in case)
  if (!selectedSet) {
    navigate("/notfound");
    return null;
  }

  // Pass the selected set's Cards and nameKey to GameBoard
  return (
    <GameBoard
      cards={selectedSet.Cards}
      cardSetName={selectedSet.nameKey}
      isGuest={isGuest}
    />
  );
}

export default PlayCardSet;