import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import GameOverDialogue from "./GameOverDialogue";
import "./GameBoard.css";

const SESSION_SCORES_STORAGE_KEY = "pantalone-session-scores";

function shuffleCards(cardList) {
  if (!cardList) {
    return [];
  }

  return [...cardList, ...cardList]
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({
      id: index,
      cardName: card.cardName,
      cardImage: card.cardImage,
    }));
}

function getStoredSessionScores(cardSetName) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(`${SESSION_SCORES_STORAGE_KEY}:${cardSetName}`);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Unable to read session scores", error);
    return [];
  }
}

function saveStoredSessionScores(cardSetName, scores) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${SESSION_SCORES_STORAGE_KEY}:${cardSetName}`, JSON.stringify(scores));
}

function GameBoard({ cards: initialCards, cardSetName, isGuest = false }) {
  const [cards, setCards] = useState(() => shuffleCards(initialCards));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState({ score: null, cardSet: null });
  const [sessionScores, setSessionScores] = useState(() => getStoredSessionScores(cardSetName));

  useEffect(() => {
    setCards(shuffleCards(initialCards));
    setFlippedIndices([]);
    setSolvedIndices([]);
    setTurns(0);
    setMatches(0);
    setIsGameOver(false);
    setGameScore({ score: null, cardSet: null });
  }, [initialCards, cardSetName]);

  useEffect(() => {
    saveStoredSessionScores(cardSetName, sessionScores);
  }, [cardSetName, sessionScores]);

  const handleCardClick = (id) => {
    if (flippedIndices.includes(id) || solvedIndices.includes(id) || isGameOver) {
      return;
    }

    const nextFlippedIndices = [...flippedIndices, id];
    setFlippedIndices(nextFlippedIndices);

    if (nextFlippedIndices.length === 2) {
      const firstIndex = nextFlippedIndices[0];
      const firstCard = cards.find((card) => card.id === firstIndex);
      const clickedCard = cards.find((card) => card.id === id);
      const newTurnCount = turns + 1;
      setTurns(newTurnCount);

      if (firstCard?.cardName === clickedCard?.cardName) {
        setSolvedIndices((prevSolvedIndices) => [...prevSolvedIndices, firstIndex, id]);
        setMatches((prevMatches) => prevMatches + 1);
      }

      setTimeout(() => {
        setFlippedIndices([]);
        if (solvedIndices.length + 2 === cards.length && cards.length > 0) {
          setIsGameOver(true);
          setGameScore({ score: newTurnCount, cardSet: cardSetName });
          setSessionScores((prevScores) => [
            ...prevScores,
            {
              turns: newTurnCount,
              date: new Date().toISOString(),
              cardSet: cardSetName,
            },
          ]);
        }
      }, 1000);
    }
  };

  const handleReset = () => {
    setCards(shuffleCards(initialCards));
    setFlippedIndices([]);
    setSolvedIndices([]);
    setTurns(0);
    setMatches(0);
    setGameScore({ score: null, cardSet: null });
  };

  if (!cards || cards.length === 0) {
    return <div>No cards to display.</div>;
  }

  return (
    <div className="game-container">
      <Score matches={matches} turns={turns} />
      <div className="game-board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            image={card.cardImage}
            isFlipped={
              flippedIndices.includes(card.id) ||
              solvedIndices.includes(card.id)
            }
            onClick={handleCardClick}
          />
        ))}
      </div>
      {isGameOver && (
        <GameOverDialogue
          onClose={() => setIsGameOver(false)}
          newTurnCount={gameScore.score}
          cardSet={gameScore.cardSet}
          isGuest={isGuest}
          handleReset={handleReset}
          sessionScores={sessionScores}
        />
      )}
    </div>
  );
}

export default GameBoard;