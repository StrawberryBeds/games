import { useState, useEffect } from "react";
import "./GameOverDialogue.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
  generatePlayerNameOptions, 
  getStoredGuestPlayerName, 
  setStoredGuestPlayerName 
} from '../utils/playerNameGenerator';
import { saveGlobalScore } from '../utils/globalLeaderboardHelpers';

function SlideGameOverDialogue({ 
  onClose, 
  moveCount, 
  slideSet, 
  isGuest, 
  playerScores, 
  handleReset,
  globalLeaderboardResult = null,
  selectedPlayer = null
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Guest-specific state
  const [playerNameOptions, setPlayerNameOptions] = useState([]);
  const [selectedPlayerName, setSelectedPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestRank, setGuestRank] = useState(null);
  const [guestPersonalBest, setGuestPersonalBest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Filter scores for the current slide set (game type = "slide")
  const scoresForSlideSet = Array.isArray(playerScores)
    ? playerScores.filter(score => score.gameType === "slide" && score.slideSet === slideSet)
    : [];

  const moves = scoresForSlideSet.map(score => score.moves || score.turns);
  const gameCount = moves.length + 1;
  const personalBest = moves.length > 0 ? Math.min(...moves) : null;
  const avgScore = (moves.reduce((a, b) => a + b, 0) + moveCount) / gameCount;

  // Initialize username options for guest
  useEffect(() => {
    if (isGuest) {
      const storedPlayerName = getStoredGuestPlayerName();
      const storedBest = localStorage.getItem('guestSlidePersonalBest');
      
      if (storedPlayerName) {
        setSelectedPlayerName(storedPlayerName);
        if (storedBest) {
          setGuestPersonalBest(parseInt(storedBest));
        }
      }
      
      setPlayerNameOptions(generatePlayerNameOptions());
    }
  }, [isGuest]);

  const handlePlayerNameSelect = (playerName) => {
    setSelectedPlayerName(playerName);
  };

  const handleGenerateNew = () => {
    setPlayerNameOptions(generatePlayerNameOptions());
  };

  const handleSubmitScore = async () => {
    if (!selectedPlayerName) return;
    
    setIsSubmitting(true);
    
    try {
      const { rank, isPersonalBest, bestScore } = await saveGlobalScore(
        selectedPlayerName, 
        moveCount, 
        `slide_${slideSet}`
      );
      
      setStoredGuestPlayerName(selectedPlayerName);
      setGuestRank(rank);
      setGuestPersonalBest(bestScore);
      localStorage.setItem('guestSlidePersonalBest', bestScore);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Error saving score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guest player flow
  if (isGuest) {
    // Show username selection
    if (!showResults) {
      return (
        <div className="modal">
          <div className="modal-content">
            <h2>Puzzle Complete!</h2>
            <div className="score-display">
              <p className="large-score">Moves: {moveCount}</p>
              {guestPersonalBest && moveCount < guestPersonalBest && (
                <p className="personal-best">New Personal Best!</p>
              )}
              {guestPersonalBest && moveCount >= guestPersonalBest && (
                <p>Personal Best: {guestPersonalBest} moves</p>
              )}
            </div>
            
            <div className="username-selection">
              <h3>Choose a username to save your score</h3>
              <div className="username-options">
                {playerNameOptions.map((playerName, index) => (
                  <button
                    key={index}
                    className={`username-option ${selectedPlayerName === playerName ? 'selected' : ''}`}
                    onClick={() => handlePlayerNameSelect(playerName)}
                  >
                    {playerName}
                  </button>
                ))}
              </div>
              <button 
                className="generate-new-btn"
                onClick={handleGenerateNew}
              >
                Generate New Names
              </button>
            </div>

            <div className="modal-buttons">
              <button 
                onClick={handleSubmitScore}
                disabled={!selectedPlayerName || isSubmitting}
                className="primary-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
              <button onClick={() => { handleReset(); onClose(); }}>
                Skip
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Show results after submission
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Score Submitted!</h2>
          <div className="results-display">
            <p className="username-display">
              Playing as: {selectedPlayerName}
            </p>
            <p className="rank-display">
              Rank: #{guestRank}
            </p>
            {moveCount < guestPersonalBest && (
              <p className="personal-best">
                New Personal Best: {moveCount} moves
              </p>
            )}
          </div>
          
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              Play Again
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="primary-btn"
            >
              Sign Up to Save Your Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registered player flows
  if (!isGuest && gameCount === 1) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Puzzle Solved!</h2>
          <div className="score-display">
            <p className="large-score">Moves: {moveCount}</p>
          </div>
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              Play Again
            </button>
            <button onClick={() => navigate('/home')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  } 
  
  if (!isGuest && gameCount >= 2) {
    if (moveCount < personalBest) {
      return (
        <div className="modal">
          <div className="modal-content">
            <h2>Puzzle Solved!</h2>
            <div className="score-display">
              <p className="large-score">Moves: {moveCount}</p>
              <p className="personal-best">New Personal Best!</p>
            </div>
            <div className="stats-display">
              <p>Previous Best: {personalBest} moves</p>
              <p>Average: {avgScore.toFixed(1)} moves over {gameCount} games</p>
            </div>
            <div className="modal-buttons">
              <button onClick={() => { handleReset(); onClose(); }}>
                Play Again
              </button>
              <button onClick={() => navigate('/home')}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal">
          <div className="modal-content">
            <h2>Puzzle Solved!</h2>
            <div className="score-display">
              <p className="large-score">Moves: {moveCount}</p>
            </div>
            <div className="stats-display">
              <p>Personal Best: {personalBest} moves</p>
              <p>Average: {avgScore.toFixed(1)} moves over {gameCount} games</p>
            </div>
            <div className="modal-buttons">
              <button onClick={() => { handleReset(); onClose(); }}>
                Play Again
              </button>
              <button onClick={() => navigate('/home')}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
  } 

  return null;
}

export default SlideGameOverDialogue;
