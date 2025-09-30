// src/components/CardSetSelection.jsx
import { useNavigate } from "react-router-dom";
import "./CardSetSelection.css";
import CardSet from "./CardSet";
import cardSets from "../data/cardSets";
import { usePlayerSelection } from "../context/usePlayerSelection";

function CardSetSelection() {
  const selectedPlayer = usePlayerSelection()
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/cardSet/${id}`);
    console.log("CardSetSelection: ", selectedPlayer)
  };

  return (
    <div className="selection-container">
      <div className="cardsets">
        {cardSets.map((cardSet) => (
          <CardSet
            key={cardSet.id}
            id={cardSet.id}
            image={cardSet.image}
            name={cardSet.name}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}

export default CardSetSelection;
