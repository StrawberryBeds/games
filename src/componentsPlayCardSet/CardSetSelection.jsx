// src/components/CardSetSelection.jsx
import { useNavigate } from "react-router-dom";
import "./CardSetSelection.css";
import CardSet from "./CardSet";
import cardSets from "../data/cardSets";

function CardSetSelection() {
  const navigate = useNavigate();

const handleCardClick = (id, nameKey) => {
  navigate(`/auth/cardSet/${id}`,  nameKey  );
  console.log("Navigating to card set:", id, nameKey);
};


  return (
    <div className="selection-container">
      <div className="cardsets">
        {cardSets.map((cardSet) => (
          <CardSet
            key={cardSet.id}
            id={cardSet.id}
            image={cardSet.image}
            nameKey={cardSet.nameKey}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}

export default CardSetSelection;
