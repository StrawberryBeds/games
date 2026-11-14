import { useNavigate } from "react-router-dom";
import "./SlidePuzzleSelection.css";
import SlidePuzzleSet from "./SlidePuzzleSet.jsx";
import slideSets from "../data/slideSets";
function SlidePuzzleSelection() {
  const navigate = useNavigate();
  const handlePuzzleClick = (id, nameKey) => {
    navigate(`/auth/slidepuzzle/${id}`, nameKey);
  };
  return (
    <div className="selection-container">
      <h1>Choose a Puzzle</h1>
      <div className="slidesets">
        {slideSets.map((slideSet) => (
          <SlidePuzzleSet
            key={slideSet.id}
            id={slideSet.id}
            image={slideSet.image}
            nameKey={slideSet.nameKey}
            onClick={handlePuzzleClick}
          />
        ))}
      </div>
    </div>
  );
}
export default SlidePuzzleSelection;