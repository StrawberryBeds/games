import React, { useState, useEffect, useCallback } from "react";
import "./SlidePuzzle.css";
import SlidePuzzleScore from "./SlidePuzzleScore";
import SlidePuzzleGameOverDialogue from "./SlidePuzzleGameOverDialogue";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { usePlayerSelection } from "../context/usePlayerSelection";
function SlidePuzzle({ imageUrl, puzzleName, isGuest = false }) {
  const [tiles, setTiles] = useState([]);
  const [turns, setTurns] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState({ score: null, puzzleName: null });
  const { selectedPlayer } = usePlayerSelection();
  const [playerScores, setPlayerScores] = useState({});
  const isSolvablePuzzle = (puzzle) => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] > puzzle[j] && puzzle[i] !== 0 && puzzle[j] !== 0) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };
  const generateTiles = () => {
    const newTiles = Array.from({ length: 9 }, (_, i) => i);
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    return newTiles;
  };
  const initializeGame = () => {
    let newTiles;
    let attempts = 0;
    do {
      newTiles = generateTiles();
      attempts++;
    } while (!isSolvablePuzzle(newTiles) && attempts < 100);
    setTiles(newTiles);
    setTurns(0);
    setIsGameOver(false);
  };
  useEffect(() => {
    initializeGame();
  }, [imageUrl]);
  useEffect(() => {
    const fetchScores = async () => {
      if (selectedPlayer?.playerId) {
        try {
          const playerDoc = await getDoc(doc(db, "players", selectedPlayer.playerId));
          if (playerDoc.exists()) {
            const playerData = playerDoc.data();
            setPlayerScores(playerData.slidePuzzleScores || {});
          }
        } catch (error) {
          console.error("Error fetching player scores:", error);
        }
      }
    };
    fetchScores();
  }, [selectedPlayer]);
  const handleTileClick = (index) => {
    const emptyIndex = tiles.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    const clickedRow = Math.floor(index / 3);
    const clickedCol = index % 3;
    const isAdjacent =
      (Math.abs(emptyRow - clickedRow) === 1 && emptyCol === clickedCol) ||
      (Math.abs(emptyCol - clickedCol) === 1 && emptyRow === clickedRow);
    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      const newTurns = turns + 1;
      setTurns(newTurns);
      if (isSolved(newTiles)) {
        setIsGameOver(true);
        setGameScore({ score: newTurns, puzzleName });
        if (!isGuest && selectedPlayer?.playerId) {
          saveScore(newTurns);
        }
      }
    }
  };
  const isSolved = (puzzle) => {
    for (let i = 0; i < 8; i++) {
      if (puzzle[i] !== i + 1) return false;
    }
    return puzzle[8] === 0;
  };
  const handleReset = () => {
    initializeGame();
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
        puzzleName,
      };
      await updateDoc(doc(db, "players", selectedPlayer.playerId), {
        slidePuzzleScores: arrayUnion(scoreEntry),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };
  return (
    <div className="slide-puzzle-container">
      <SlidePuzzleScore turns={turns} />
      <div className="slide-puzzle-board">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`slide-tile ${tile === 0 ? "empty" : ""}`}
            onClick={() => handleTileClick(index)}
            style={{
              backgroundImage: tile !== 0 ? `url('${imageUrl}')` : "none",
              backgroundPosition: `${((tile % 3) * 33.33)}% ${(Math.floor(tile / 3) * 33.33)}%`,
              backgroundSize: "300% 300%",
            }}
          >
            {tile !== 0 && <span className="tile-number">{tile}</span>}
          </div>
        ))}
      </div>
      {isGameOver && (
        <SlidePuzzleGameOverDialogue
          onClose={() => setIsGameOver(false)}
          newTurnCount={gameScore.score}
          puzzleName={gameScore.puzzleName}
          playerScores={playerScores}
          handleReset={handleReset}
        />
      )}
    </div>
  );
}
export default SlidePuzzle;