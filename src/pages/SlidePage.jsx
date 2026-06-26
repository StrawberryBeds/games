import { useParams, Navigate } from "react-router-dom";
import SlideBoard from "../componentsPlayCardSet/SlideBoard";
import slideSets from "../data/slideSets";

function SlidePage({ isGuest = true }) {
  const { id } = useParams();
  const selectedSet = slideSets.find((set) => set.id === id) || slideSets[0];

  if (!selectedSet) {
    return <Navigate to="/notfound" replace />;
  }

  return (
    <SlideBoard
      tileImage={selectedSet.tileImage}
      slideSetName={selectedSet.nameKey}
      isGuest={isGuest}
    />
  );
}

export default SlidePage;
