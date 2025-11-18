import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import GameBoard from "../componentsPlayCardSet/GameBoard";
import cardSets from "../data/cardSets";

function PlayCardSet({ isGuest = false }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const cardSet = cardSets.find(set => set.id === id);


  // Redirect if not a guest and not logged in
  if (!isGuest && !currentUser) {
    navigate("/home");
    return null;
  }

  // For guests, default to the first card set if id is invalid
  const selectedSet = cardSets.find((set) => set.id === id) || cardSets[0];

  // If still no set (shouldn't happen, but just in case)
  if (!selectedSet) {
    navigate("/notfound");
    return null;
  }

  // Pass the selected set's Cards to GameBoard
  return (
    <GameBoard
      cards={cardSet.Cards}
      cardSetName={cardSet.nameKey} // Pass nameKey, not name
      isGuest={isGuest}
    />
  );
}

export default PlayCardSet;
