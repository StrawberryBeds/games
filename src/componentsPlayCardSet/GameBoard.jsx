import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import GameOverDialogue from "./GameOverDialogue";
import "./GameBoard.css";

import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { usePlayerSelection } from "../context/usePlayerSelection";
import { saveGlobalScore } from "../utils/globalLeaderboardHelpers";

// Import the monthly cardSet identifier from your home page
// You can make this dynamic later or pass it as a prop
const MONTHLY_CARDSET_KEY = "christmas"; // This should match cardSets[2].nameKey

function GameBoard({ cards: initialCards, cardSetName, isGuest = false }) {
  const [cards, setCards] = useState(shuffleCards(initialCards));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState({ score: null, cardSet: null });
  const [globalLeaderboardResult, setGlobalLeaderboardResult] = useState(null);

  const { selectedPlayer } = usePlayerSelection();
  const [playerScores, setPlayerScores] = useState({});

  useEffect(() => {
    const fetchPlayerScores = async () => {
      try {
        const playerDoc = await getDoc(doc(db, "players", selectedPlayer.playerId));
        if (playerDoc.exists()) {
          const playerData = playerDoc.data();
          setPlayerScores(playerData.scores || {});
        }
      } catch (error) {
        console.error("Error fetching player scores:", error);
      }
    };
    if (selectedPlayer?.playerId) {
      fetchPlayerScores();
    }
  }, [selectedPlayer]);

  function shuffleCards(cardList) {
    if (!cardList) {
      return [];
    }
    const duplicatedCards = [...cardList, ...cardList]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        cardName: card.cardName,
        cardImage: card.cardImage,
      }));
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
      const newTurnCount = turns + 1;
      setTurns(newTurnCount);

      if (firstCard.cardName === clickedCard.cardName) {
        setSolvedIndices((prevSolvedIndices) => [...prevSolvedIndices, firstIndex, id]);
        setMatches((prevMatches) => prevMatches + 1);
      }

      setTimeout(async () => {
        setFlippedIndices([]);
        if (solvedIndices.length + 2 === cards.length && cards.length > 0) {
          console.log("Game over! Score:", newTurnCount, "Card set:", cardSetName);
          setIsGameOver(true);
          setGameScore({ score: newTurnCount, cardSet: cardSetName });
          
          if (!isGuest) {
            // Registered player - save to their player document
            await saveScore(newTurnCount);
            
            // Also save to global leaderboard if playing monthly cardSet
            if (cardSetName === MONTHLY_CARDSET_KEY && selectedPlayer?.playerName) {
              try {
                const result = await saveGlobalScore(
                  selectedPlayer.playerName,
                  newTurnCount,
                  cardSetName
                );
                setGlobalLeaderboardResult(result);
                console.log("Registered player score saved to global leaderboard:", result);
              } catch (error) {
                console.error("Error saving registered player to global leaderboard:", error);
              }
            }
          }
          // Guest players handle global leaderboard in GameOverDialogue
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
        turns: currentTurns,
        date: new Date().toISOString(),
        cardSet: cardSetName,
      };
      await updateDoc(doc(db, "players", selectedPlayer.playerId), {
        scores: arrayUnion(scoreEntry),
      });
      console.log("Score saved to player document:", scoreEntry);
    } catch (error) {
      console.error("Error saving score to player document:", error);
    }
  };

  const handleReset = () => {
    setCards(shuffleCards(initialCards));
    setFlippedIndices([]);
    setSolvedIndices([]);
    setTurns(0);
    setMatches(0);
    setGlobalLeaderboardResult(null);
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
          selectedPlayer={selectedPlayer}
          playerScores={playerScores}
          handleReset={handleReset}
          isMonthlyCardSet={cardSetName === MONTHLY_CARDSET_KEY}
          globalLeaderboardResult={globalLeaderboardResult}
        />
      )}
    </div>
  );
}

export default GameBoard;