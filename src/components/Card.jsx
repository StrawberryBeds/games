import React from 'react';
import './Card.css';

function Card({ id, image, isFlipped, onClick }) {
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={() => onClick(id)}>
      <div className="card-face card-front">
        <img src={image} alt="Card front" />
      </div>
      <div className="card-face card-back">
        <img src="/path-to-your-face-down-image.jpg" alt="Card back" />
      </div>
    </div>
  );
}

export default Card;
