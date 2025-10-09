import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import ResetButton from "./ResetButton";
import GameOverDialogue from "./GameOverDialogue";
import "./GameBoard.css";

import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { usePlayerSelection } from "../context/usePlayerSelection";

function GameBoard({ cards: initialCards, cardSetName }) {
  console.log("Initial Cards in GameBoard:", initialCards); // Debug line

  const [cards, setCards] = useState(shuffleCards(initialCards));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState(null);


  const { selectedPlayer } = usePlayerSelection();

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
      const newTurnCount = turns + 1; // Calculate the new turn count immediately
      setTurns(newTurnCount); // Update the state
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
        // Check for game completion AFTER the flip
        if (solvedIndices.length + 2 === cards.length && cards.length > 0) {
          setIsGameOver(true);
          setGameScore(newTurnCount)
          saveScore(newTurnCount); // Pass the latest turn count directly
        }
      }, 1000);
    }
  };

  const saveScore = async (currentTurns) => {
    try {
      const playerDoc = await getDoc(doc(db, "players", selectedPlayer.playerId));
      if (!playerDoc.exists()) {
        throw new Error("Player profile not found");
      }
      const scoreEntry = {
        turns: currentTurns, // Use the passed turn count
        date: new Date().toISOString(),
        cardSet: cardSetName,
      };
      await updateDoc(doc(db, "players", selectedPlayer.playerId), {
        scores: arrayUnion(scoreEntry),
      });
      console.log("Score saved successfully!", scoreEntry);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };


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
          newTurnCount={gameScore}
        />
      )}
    </div>
  );
}

export default GameBoard;
