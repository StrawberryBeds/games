import React from "react";
import { useTranslation } from "react-i18next";
import "./SlidePuzzleScore.css";
function SlidePuzzleScore({ turns }) {
  const { t } = useTranslation();
  return (
    <div className="slide-puzzle-score">
      <div className="score-item">
        <span className="score-label">{t("turns")}:</span>
        <span className="score-value">{turns}</span>
      </div>
    </div>
  );
}
export default SlidePuzzleScore;