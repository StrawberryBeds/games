import { useNavigate } from "react-router-dom";
import "./ChooseGame.css";
function ChooseGame() {
  const navigate = useNavigate();
  return (
    <div className="choose-game-container">
      <h1>Choose a Game</h1>
      <div className="game-options">
        <div className="game-option" onClick={() => navigate("/auth/chooseset")}>
          <div className="game-option-content">
            <h2>Card Matching</h2>
            <p>Test your memory by matching pairs of cards</p>
          </div>
        </div>
        <div className="game-option" onClick={() => navigate("/auth/choosepuzzle")}>
          <div className="game-option-content">
            <h2>Slide Puzzle</h2>
            <p>Solve the sliding tile puzzle</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChooseGame;