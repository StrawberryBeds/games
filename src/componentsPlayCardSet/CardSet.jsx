// src/components/CardSet.jsx
import './CardSet.css';

function CardSet({ id, image, onClick }) {
  console.log("Image source:", image); // Debug line
  return (
    <div className="cardset" onClick={() => onClick(id)}>
      <div className="cardset-face cardset-front">
        <img src={image} alt="CardSetName" />
        {/* <p>{name}</p> */}
      </div>
    </div>
  );
}

export default CardSet;
