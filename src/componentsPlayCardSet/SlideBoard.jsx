import React, { useState, useEffect } from "react";
import SlideTile from "./SlideTile";
import SlideGameOverDialogue from "./SlideGameOverDialogue";
import "./SlideBoard.css";
import { useTranslation } from "react-i18next";
import {
  initializeSlideGrid,
  isAdjacentToEmpty,
  slideTile,
  shuffleSlideGrid,
  isGridSolved,
} from "../utils/slideGameUtils";

const SESSION_SCORES_STORAGE_KEY = "pantalone-session-scores";

function getStoredSessionScores(slideSetName) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(`${SESSION_SCORES_STORAGE_KEY}:${slideSetName}`);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Unable to read session scores", error);
    return [];
  }
}

function saveStoredSessionScores(slideSetName, scores) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${SESSION_SCORES_STORAGE_KEY}:${slideSetName}`, JSON.stringify(scores));
}

function SlideBoard({ tileImage, slideSetName, isGuest = false }) {
  const { t } = useTranslation();
  const [tiles, setTiles] = useState(initializeSlideGrid());
  const [originalTiles, setOriginalTiles] = useState(initializeSlideGrid());
  const [moveCount, setMoveCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState({ score: null, slideSet: null });
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionScores, setSessionScores] = useState(() => getStoredSessionScores(slideSetName));

  useEffect(() => {
    setOriginalTiles(initializeSlideGrid());
    setTiles(initializeSlideGrid());
    setMoveCount(0);
    setHasStarted(false);
    setIsGameOver(false);
    setGameScore({ score: null, slideSet: null });
  }, [slideSetName]);

  useEffect(() => {
    saveStoredSessionScores(slideSetName, sessionScores);
  }, [slideSetName, sessionScores]);

  const handleShuffle = () => {
    const shuffledTiles = shuffleSlideGrid(originalTiles, 100);
    setTiles(shuffledTiles);
    setMoveCount(0);
    setHasStarted(true);
    setIsGameOver(false);
  };

  const handleTileClick = (tileIndex) => {
    if (!hasStarted) return;
    if (isGameOver) return;

    if (!isAdjacentToEmpty(tiles, tileIndex)) {
      return;
    }

    const newTiles = slideTile(tiles, tileIndex);
    setTiles(newTiles);

    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    if (isGridSolved(newTiles)) {
      setIsGameOver(true);
      setGameScore({ score: newMoveCount, slideSet: slideSetName });
      setSessionScores((prevScores) => [
        ...prevScores,
        {
          moves: newMoveCount,
          date: new Date().toISOString(),
          slideSet: slideSetName,
          gameType: "slide",
        },
      ]);
    }
  };

  const handleReset = () => {
    setTiles(initializeSlideGrid());
    setMoveCount(0);
    setHasStarted(false);
    setIsGameOver(false);
    setGameScore({ score: null, slideSet: null });
  };

  return (
    <div className="slide-game-container">
      <div className="slide-header">
        <div className="slide-stats">
          <h3 className="move-counter">{t('score.slide_moves')} {moveCount}</h3>
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
          handleReset={handleReset}
          sessionScores={sessionScores}
        />
      )}
    </div>
  );
}

export default SlideBoard;
