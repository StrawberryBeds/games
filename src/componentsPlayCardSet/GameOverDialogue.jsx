import React from "react";
import "./GameOverDialogue.css";
import { useNavigate } from "react-router-dom";
import { usePlayerSelection } from "../context/usePlayerSelection";

function GameOverDialogue({ onClose, newTurnCount, cardSet, playerScores, handleReset }) {
  const navigate = useNavigate();
  // Filter scores for the current card set or an empty array if no scores.
 const scoresForCardSet = (playerScores || []).filter(score => score.cardSet === cardSet);
  // Extract turns into an array
  const turns = scoresForCardSet.map(scores => scores.turns);
  const gameCount = turns.length + 1; // Including current game
  const personalBest = turns.length > 0 ? Math.min(...turns) : null;

  const avgScore = (turns.reduce((a, b) => a + b, 0) + newTurnCount) / gameCount;

  console.log("Scores for card set:", cardSet, turns); // Debug
  console.log("Game count:", gameCount, "Personal best:", personalBest); // Debug
  console.log("Average score:", avgScore);

  if (gameCount === 1) {
    return (
      <div className="modal">
        <div>You matched all the cards in {newTurnCount} turns! Can you beat it?</div>
          <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>Play again</button>
          <button onClick={() => navigate('/games')}>Play a Another Card Set</button>
          </div>
      </div>
    );
  } else if (gameCount === 2) {
    if (newTurnCount < personalBest) {
      return (
        <div className="modal">
          <div>You matched all the cards in {newTurnCount} turns!</div>
          <div>Well done! That's a new personal best for {cardSet}!</div>
          <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>Play again</button>
          <button onClick={() => navigate('/games')}>Play a Another Card Set</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal">
          <div>You matched all the cards in {newTurnCount} turns!</div>
          <div>Bad luck! Try to beat {personalBest} for a new personal best for {cardSet}!</div>
          <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>Play again</button>
          <button onClick={() => navigate('/games')}>Play a Another Card Set</button>
          </div>
        </div>
      );
    }
  } else if (gameCount >= 3) {
    if (newTurnCount < personalBest) {
      return (
        <div className="modal">
          <div>You matched all the cards in {newTurnCount} turns!</div>
          <div>Well done! That's a new personal best for {cardSet}!</div>
          <div>Your average for {cardSet} is {avgScore} turns over {gameCount} games</div>
          <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>Play again</button>
          <button onClick={() => navigate('/games')}>Play a Another Card Set</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal">
          <div>You matched all the cards in {newTurnCount} turns!</div>
          <div>Bad luck! Try to beat {personalBest} for a new personal best for {cardSet}!</div>
          <div>Your average score for {cardSet} is {avgScore.toFixed(1)} turns over {gameCount} games.</div>
          <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>Play again</button>
          <button onClick={() => navigate('/games')}>Play a Another Card Set</button>
          </div>
        </div>
      );
    }
  }
}

export default GameOverDialogue;
//   const scores = selectedPlayer?.scores || [];
//   const gameCount = scores.length + 1; // Including current game
//     const { currentUser } = useAuth();
//     const { selectedPlayer, setRequiresParentAuth } = usePlayerSelection();
//     const [playerProfile, setPlayerProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);


//   else { // gameCount >= 3
//     const isPersonalBest = currentScore < Math.min(...scores);
//     const avgScore = (scores.reduce((a, b) => a + b, 0) + currentScore) / gameCount;
//     const message = isPersonalBest
//       ? `That’s a new personal best! You’ve played ${gameCount} games with an average of ${avgScore.toFixed(1)} turns.`
//       : `You’ve played ${gameCount} games with an average of ${avgScore.toFixed(1)} turns.`;
//     return {
//       message,
//       showConfetti: isPersonalBest,
//     };
//   }

