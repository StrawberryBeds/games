// src/components/CardSet.jsx
import './CardSet.css';

function CardSet({ id, image, onClick }) {

  return (
    <div className="cardset"
      onClick={() => onClick(id)}
      role="button">
      <div className="cardset-face cardset-front">
        <img src={image} alt="CardSetName"
          width="80"
          height="80" />
        {/* <p>{name}</p> */}
      </div>
    </div>
  );
}

export default CardSet; 
