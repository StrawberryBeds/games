import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import SlidePuzzle from "../componentsPlaySlidePuzzle/slidePuzzle";
import slideSets from "../data/slideSets";
import { useState, useEffect } from "react";
function PlaySlidePuzzle({ isGuest = false }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (!isGuest && !currentUser) {
      navigate("/signin");
      return;
    }
    const selectedSet = slideSets.find((set) => set.id === id) || slideSets[0];
    if (!selectedSet) {
      navigate("/notfound");
      return;
    }
    setImageUrl(selectedSet.image);
  }, [id, isGuest, currentUser, navigate]);
  if (!imageUrl) {
    return <div>Loading...</div>;
  }
  const slideSet = slideSets.find((set) => set.id === id);
  const puzzleName = slideSet?.nameKey || "unknown";
  return (
    <SlidePuzzle
      imageUrl={imageUrl}
      puzzleName={puzzleName}
      isGuest={isGuest}
    />
  );
}
export default PlaySlidePuzzle;