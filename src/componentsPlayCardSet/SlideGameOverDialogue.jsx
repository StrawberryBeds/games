import "./GameOverDialogue.css";

function SlideGameOverDialogue({
  onClose,
  moveCount,
  slideSet,
  handleReset,
  sessionScores = []
}) {
  const scoresForSlideSet = Array.isArray(sessionScores)
    ? sessionScores.filter((score) => score.gameType === "slide" && score.slideSet === slideSet)
    : [];

  const moves = scoresForSlideSet.map((score) => score.moves || score.turns);
  const gameCount = moves.length;
  const personalBest = gameCount > 0 ? Math.min(...moves) : null;
  const averageScore = gameCount > 0
    ? moves.reduce((sum, value) => sum + value, 0) / gameCount
    : moveCount;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Puzzle Complete</h2>
        <div className="score-display">
          <p className="large-score">Moves: {moveCount}</p>
          {personalBest !== null && (
            <p className="personal-best">Personal best this session: {personalBest} moves</p>
          )}
          <p>Average this session: {averageScore.toFixed(1)} moves over {gameCount} games</p>
        </div>

        <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>
            Play Again
          </button>
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SlideGameOverDialogue;
