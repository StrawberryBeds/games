import "./GameOverDialogue.css";

function GameOverDialogue({
  onClose,
  newTurnCount,
  cardSet,
  handleReset,
  sessionScores = []
}) {
  const scoresForCardSet = Array.isArray(sessionScores)
    ? sessionScores.filter((score) => score.cardSet === cardSet)
    : [];

  const turns = scoresForCardSet.map((score) => score.turns);
  const gameCount = turns.length;
  const personalBest = gameCount > 0 ? Math.min(...turns) : newTurnCount;
  const averageScore = gameCount > 0
    ? turns.reduce((sum, value) => sum + value, 0) / gameCount
    : newTurnCount;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Game Complete</h2>
        <div className="score-display">
          <p className="large-score">Score: {newTurnCount} turns</p>
          <p className="personal-best">Personal best this session: {personalBest} turns</p>
          <p>Average this session: {averageScore.toFixed(1)} turns over {gameCount} games</p>
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

export default GameOverDialogue;