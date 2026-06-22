import React, { useState, useEffect } from "react";
import SlideTile from "./SlideTile";
import SlideGameOverDialogue from "./SlideGameOverDialogue";
import "./SlideBoard.css";

import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { usePlayerSelection } from "../context/usePlayerSelection";
import { saveGlobalScore } from "../utils/globalLeaderboardHelpers";
import {
  initializeSlideGrid,
  isAdjacentToEmpty,
  slideTile,
  shuffleSlideGrid,
  isGridSolved,
} from "../utils/slideGameUtils";

const MONTHLY_SLIDESET_KEY = "birds"; // Default slide set

function SlideBoard({ tileImage, slideSetName, isGuest = false }) {
  const [tiles, setTiles] = useState(initializeSlideGrid());
  const [originalTiles, setOriginalTiles] = useState(initializeSlideGrid());
  const [moveCount, setMoveCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState({ score: null, slideSet: null });
  const [globalLeaderboardResult, setGlobalLeaderboardResult] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

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

  const handleShuffle = () => {
    const shuffledTiles = shuffleSlideGrid(originalTiles, 100);
    setTiles(shuffledTiles);
    setMoveCount(0);
    setHasStarted(true);
    setIsGameOver(false);
  };

  const handleTileClick = (tileIndex) => {
    if (!hasStarted) return; // Can't click tiles before shuffle
    if (isGameOver) return; // Can't click tiles after game over

    if (!isAdjacentToEmpty(tiles, tileIndex)) {
      return; // Invalid move, tile not adjacent to empty
    }

    const newTiles = slideTile(tiles, tileIndex);
    setTiles(newTiles);
    
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    // Check if puzzle is solved
    if (isGridSolved(newTiles)) {
      setIsGameOver(true);
      setGameScore({ score: newMoveCount, slideSet: slideSetName });

      if (!isGuest) {
        // Registered player - save to their player document
        saveScore(newMoveCount);

        // Also save to global leaderboard
        if (slideSetName === MONTHLY_SLIDESET_KEY && selectedPlayer?.playerName) {
          try {
            const result = saveGlobalScore(
              selectedPlayer.playerName,
              newMoveCount,
              `slide_${slideSetName}`
            );
            setGlobalLeaderboardResult(result);
            console.log("Registered player score saved to global leaderboard:", result);
          } catch (error) {
            console.error("Error saving registered player to global leaderboard:", error);
          }
        }
      }
    }
  };

  const saveScore = async (currentMoves) => {
    try {
      const playerDoc = await getDoc(doc(db, "players", selectedPlayer.playerId));
      if (!playerDoc.exists()) {
        throw new Error("Player profile not found");
      }
      const scoreEntry = {
        moves: currentMoves,
        date: new Date().toISOString(),
        slideSet: slideSetName,
        gameType: "slide",
      };
      await updateDoc(doc(db, "players", selectedPlayer.playerId), {
        scores: arrayUnion(scoreEntry),
      });
      console.log("Slide game score saved to player document:", scoreEntry);
    } catch (error) {
      console.error("Error saving score to player document:", error);
    }
  };

  const handleReset = () => {
    setTiles(initializeSlideGrid());
    setMoveCount(0);
    setHasStarted(false);
    setIsGameOver(false);
    setGlobalLeaderboardResult(null);
  };

  return (
    <div className="slide-game-container">
      <div className="slide-header">
        <h2>Slide Puzzle</h2>
        <div className="slide-stats">
          <p className="move-counter">Moves: {moveCount}</p>
        </div>
      </div>

      <div className="slide-board-container">
        <div className="slide-board" style={{ backgroundImage: `url(${tileImage})` }}>
          {tiles.map((tile, index) => (
            <SlideTile
              key={index}
              tileId={tile.id}
              isEmpty={tile.isEmpty}
              tileImage={tileImage}
              isAdjacent={isAdjacentToEmpty(tiles, index)}
              isClickable={hasStarted && !isGameOver}
              onClick={() => handleTileClick(index)}
            />
          ))}
        </div>
      </div>

      <div className="slide-controls">
        <button 
          className="shuffle-button" 
          onClick={handleShuffle}
          disabled={isGameOver && hasStarted}
        >
          {hasStarted ? "Shuffle Again" : "Start Puzzle"}
        </button>
      </div>

      {isGameOver && (
        <SlideGameOverDialogue
          onClose={() => setIsGameOver(false)}
          moveCount={gameScore.score}
          slideSet={gameScore.slideSet}
          isGuest={isGuest}
          selectedPlayer={selectedPlayer}
          playerScores={playerScores}
          handleReset={handleReset}
          globalLeaderboardResult={globalLeaderboardResult}
        />
      )}
    </div>
  );
}

export default SlideBoard;
