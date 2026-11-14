import React from 'react';
import './Card.css';
import cardBack from '/assets/card_back_P.svg';

function Card({ id, image, isFlipped, onClick }) {
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={() => onClick(id)}>
      <div className="card-face card-front">
        <img src={image} alt="Card front" />
      </div>
      <div className="card-face card-back">
        <img src={cardBack} alt="Card back" />
      </div>
    </div> 
  );
}

export default Card;
