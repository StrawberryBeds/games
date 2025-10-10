import React from "react";
import "./GameOverDialogue.css";
import { useNavigate } from "react-router-dom";
import { usePlayerSelection } from "../context/usePlayerSelection";

function GameOverDialogue({ onClose, newTurnCount, cardSet, playerScores }) {
  const navigate = useNavigate();
  // Filter scores for the current card set
  const scoresForCardSet = playerScores.filter(score => score.cardSet === cardSet);
  // Extract turns into an array
  const turns = scoresForCardSet.map(score => score.turns);
  const gameCount = turns.length + 1; // Including current game
  const personalBest = turns.length > 0 ? Math.min(...turns) : null;

  console.log("Scores for card set:", cardSet, turns); // Debug
  console.log("Game count:", gameCount, "Personal best:", personalBest); // Debug
  if (gameCount === 1) {
    return (
      <div className="modal">
        <div>You matched all the cards in {newTurnCount} turns! Can you beat it?</div>
        <button onClick={onClose}>Play again</button>
        <button onClick={() => navigate('/games')}>Play Games</button>
      </div>
    );
  } else if (gameCount === 2) {
    if (newTurnCount < personalBest) {
      return (
        <div className="modal">
          <div>You matched all the cards in {newTurnCount} turns!</div>
          <div>Well done! That's a new personal best for {cardSet}!</div>
          <button onClick={onClose}>Play again</button>
          <button onClick={() => navigate('/games')}>Play Games</button>
        </div>
      );
    } else {
      return (
        <div className="modal">
          <div>You matched all the cards in {newTurnCount} turns!</div>
          <div>Bad luck! Try to beat {personalBest} for a new personal best for {cardSet}!</div>
          <button onClick={onClose}>Play again</button>
          <button onClick={() => navigate('/games')}>Play Games</button>
        </div>
      );
    }
  }
  // Placeholder for other cases
  // return (
  //   <div className="modal">
  //     <div>Game Over! You took {newTurnCount} turns.</div>
  //     <button onClick={onClose}>Play again</button>
  //     <button onClick={() => navigate('/games')}>Play Games</button>
  //   </div>
  // );
}
// }

export default GameOverDialogue;
//   const scores = selectedPlayer?.scores || [];
//   const gameCount = scores.length + 1; // Including current game
//     const { currentUser } = useAuth();
//     const { selectedPlayer, setRequiresParentAuth } = usePlayerSelection();
//     const [playerProfile, setPlayerProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);


//   const navigate = useNavigate();
//   const playerId = player.playerId;

//   if (gameCount === 1) {
//     return {
//       message: `You matched all the cards in ${turns} turns! Can you beat it next time?`,
//       showConfetti: false,
//     };
//   }
//   else if (gameCount === 2) {
//     const isPersonalBest = currentScore < scores[0];
//     return {
//       message: isPersonalBest
//         ? "Well done! That’s a personal best!"
//         : "Bad luck! Want to try again?",
//       showConfetti: isPersonalBest,
//     };
//   }
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

