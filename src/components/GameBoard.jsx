import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import "./GameBoard.css";

// Import images
import balloon from "../assets/balloon_1F388.svg";
import cake from "../assets/cake_1F382.svg";
import cat from "../assets/cat_1F431.svg";
import dog from "../assets/dog_1F436.svg";
import dragon from "../assets/dragon_1F409.svg";
import octopus from "../assets/octopus_1F419.svg";
import pheonix from "../assets/pheonix_1F426-200D-1F525.svg";
import rofl from "../assets/rofl_1F923.svg";
import smiley from "../assets/smiley_1F60A.svg";
import unicorn from "../assets/unicorn_1F984.svg";

function GameBoard() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);

  function generateCards() {
    const cardImages = [
      balloon,
      cake,
      cat,
      dog,
      dragon,
      octopus,
      pheonix,
      rofl,
      smiley,
      unicorn,
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

      // Increment turns
      setTurns((prevTurns) => prevTurns + 1);

      // Check if the two flipped cards match
      if (firstCard.image === clickedCard.image) {
        // Cards match, add them to solvedIndices
        setSolvedIndices((prevSolvedIndices) => [
          ...prevSolvedIndices,
          firstIndex,
          id,
        ]);
        // Increment matches
        setMatches((prevMatches) => prevMatches + 1);
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
      alert("Congratulations! You have won the game.");
      setCards(generateCards());
      setSolvedIndices([]);
      setTurns(0);
      setMatches(0);
    }
  }, [solvedIndices, cards.length]);

  return (
    <div className="game-container">
      <Score matches={matches} turns={turns} />
      <div className="game-board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            image={card.image}
            isFlipped={
              flippedIndices.includes(card.id) ||
              solvedIndices.includes(card.id)
            }
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
