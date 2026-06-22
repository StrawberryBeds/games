import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import SlideBoard from "../componentsPlayCardSet/SlideBoard";
import slideSets from "../data/slideSets";

function SlidePage({ isGuest = false }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Redirect if not a guest and not logged in
  if (!isGuest && !currentUser) {
    navigate("/home");
    return null;
  }

  // Find the slide set by id, with fallback to first set for guests
  const selectedSet = slideSets.find((set) => set.id === id) || slideSets[0];

  // If still no set (shouldn't happen, but just in case)
  if (!selectedSet) {
    navigate("/notfound");
    return null;
  }

  // Pass the selected set's image and nameKey to SlideBoard
  return (
    <SlideBoard
      tileImage={selectedSet.tileImage}
      slideSetName={selectedSet.nameKey}
      isGuest={isGuest}
    />
  );
}

export default SlidePage;
