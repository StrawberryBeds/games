import { useParams, Navigate } from "react-router-dom";
import GameBoard from "../componentsPlayCardSet/GameBoard";
import cardSets from "../data/cardSets";

function PlayCardSet({ isGuest = true }) {
  const { id } = useParams();
  const selectedSet = cardSets.find((set) => set.id === id) || cardSets[0];

  if (!selectedSet) {
    return <Navigate to="/notfound" replace />;
  }

  return (
    <GameBoard
      cards={selectedSet.Cards}
      cardSetName={selectedSet.nameKey}
      isGuest={isGuest}
    />
  );
}

export default PlayCardSet;