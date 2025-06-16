// src/components/GameBoard.jsx
import React, { useState } from 'react';
import Card from './Card';
import './GameBoard.css'; // Create this CSS file for styling

function GameBoard() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);

  function generateCards() {
    const cardImages = [
      'src/assets/balloon_1F388.svg',
      'src/assets/cake_1F382.svg',
      'src/assets/cat_1F431.svg',
      'src/assets/dog_1F436.svg',
      'src/assets/dragon_1F409.svg',
      'src/assets/octopus_1F419.svg',
      'src/assets/pheonix_1F426-200D-1F525.svg',
      'src/assets/rofl_1F923.svg',
      'src/assets/smiley_1F60A.svg',
      'src/assets/unicorn_1F984.svg'
    ];
  // Duplicate the array to create pairs and shuffle them
  const pairs = [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((image, index) => ({
      id: index,
      image,
      isFlipped: false,
    }));

  return pairs;
}

  const handleCardClick = (id) => {
    // Logic to handle card flipping and matching
    // This will be expanded in further steps
  };

  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          image={card.image}
          isFlipped={card.isFlipped}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
}

export default GameBoard;
