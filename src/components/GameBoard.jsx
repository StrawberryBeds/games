import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import ResetButton from "./ResetButton";
import "./GameBoard.css";

function GameBoard({ cards: initialCards }) {
  console.log("Initial Cards in GameBoard:", initialCards); // Debug line

  const [cards, setCards] = useState(shuffleCards(initialCards));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);

  function shuffleCards(cardList) {
    if (!cardList) {
      console.error("Card list is undefined or null");
      return [];
    }
    const duplicatedCards = [...cardList, ...cardList]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        cardName: card.cardName,
        cardImage: card.cardImage,
      }));
    console.log("Duplicated Cards After Shuffling:", duplicatedCards); // Debug line
    return duplicatedCards;
  }

  const handleCardClick = (id) => {
    if (flippedIndices.includes(id) || solvedIndices.includes(id)) {
      return;
    }
    setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, id]);
    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      const firstCard = cards.find((card) => card.id === firstIndex);
      const clickedCard = cards.find((card) => card.id === id);
      setTurns((prevTurns) => prevTurns + 1);
      if (firstCard.cardName === clickedCard.cardName) {
        setSolvedIndices((prevSolvedIndices) => [
          ...prevSolvedIndices,
          firstIndex,
          id,
        ]);
        setMatches((prevMatches) => prevMatches + 1);
      }
      setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (solvedIndices.length === cards.length && cards.length > 0) {
      alert("Well done! Take a moment to admire your skill and get well soon!");
    }
  }, [solvedIndices, cards.length]);

  const handleReset = () => {
    setCards(shuffleCards(initialCards));
    setFlippedIndices([]);
    setSolvedIndices([]);
    setTurns(0);
    setMatches(0);
  };

  if (!cards || cards.length === 0) {
    return <div>No cards to display.</div>;
  }

  return (
    <div className="game-container">
      <Score matches={matches} turns={turns} />
      <ResetButton onClick={handleReset} />
      <div className="game-board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            image={card.cardImage}
            isFlipped={flippedIndices.includes(card.id) || solvedIndices.includes(card.id)}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;