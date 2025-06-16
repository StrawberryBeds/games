import React, { useState, useEffect } from 'react';
import Card from './Card';
import './GameBoard.css';

function GameBoard() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);

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
      }));

    return pairs;
  }

  const handleCardClick = (id) => {
    // If the card is already flipped or solved, do nothing
    if (flippedIndices.includes(id) || solvedIndices.includes(id)) {
      return;
    }

    // Flip the card
    setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, id]);

    // Check if two cards are flipped
    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      const firstCard = cards.find((card) => card.id === firstIndex);
      const clickedCard = cards.find((card) => card.id === id);

      // Check if the two flipped cards match
      if (firstCard.image === clickedCard.image) {
        // Cards match, add them to solvedIndices
        setSolvedIndices((prevSolvedIndices) => [...prevSolvedIndices, firstIndex, id]);
      }

      // Reset flipped indices after a delay to allow the user to see the second card
      setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
    }
  };

  // Reset the game if all cards are solved
  useEffect(() => {
    if (solvedIndices.length === cards.length) {
      alert('Congratulations! You have won the game.');
      setCards(generateCards());
      setSolvedIndices([]);
    }
  }, [solvedIndices, cards.length]);

  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          image={card.image}
          isFlipped={flippedIndices.includes(card.id) || solvedIndices.includes(card.id)}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
}

export default GameBoard;
