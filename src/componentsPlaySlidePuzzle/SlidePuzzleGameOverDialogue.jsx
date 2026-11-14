import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SlidePuzzleGameOverDialogue.css";
function SlidePuzzleGameOverDialogue({
  onClose,
  newTurnCount,
  puzzleName,
  playerScores,
  handleReset,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handlePlayAgain = () => {
    onClose();
    handleReset();
  };
  const handleBackToSelection = () => {
    navigate("/auth/choosepuzzle");
  };
  const bestScore = playerScores?.[puzzleName]
    ? Math.min(...playerScores[puzzleName].map((s) => s.turns))
    : null;
  return (
    <div className="slide-puzzle-game-over-overlay">
      <div className="slide-puzzle-game-over-dialogue">
        <h2>{t("gameOver")}</h2>
        <p className="turns-display">{t("turns")}: {newTurnCount}</p>
        {bestScore && <p className="best-score">{t("bestScore")}: {bestScore}</p>}
        <div className="dialogue-buttons">
          <button onClick={handlePlayAgain} className="btn-play-again">
            {t("playAgain")}
          </button>
          <button onClick={handleBackToSelection} className="btn-back">
            {t("backToSelection")}
          </button>
        </div>
      </div>
    </div>
  );
}
export default SlidePuzzleGameOverDialogue;