import React from "react";
import "./GameOverDialogue.css";
import { useNavigate } from "react-router-dom";
// const { selectedPlayer } = usePlayerSelection();

function GameOverDialogue({ onClose, newTurnCount }) {
  const navigate = useNavigate();
  // const scores = playerScores[cardSet] || [];
  // const gameCount = scores.length + 1;
  // const { selectedPlayer } = usePlayerSelection();

  // if (gameCount === 1) {
    return (
      <div className="modal">
        <div>You matched all the cards in {newTurnCount} turns! Can you beat it?</div>
        <button onClick={onClose}>Play again</button>
        <button onClick={() => navigate('/games')}>Play Games</button>
      </div>
    );
  // } else {
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

