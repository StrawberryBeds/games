import { useState, useEffect } from "react";
import "./GameOverDialogue.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
  generateUsernameOptions, 
  getStoredGuestUsername, 
  setStoredGuestUsername 
} from '../utils/usernameGenerator';
import { saveGlobalScore, getAverageScore } from '../utils/globalLeaderboardHelpers';

function GameOverDialogue({ 
  onClose, 
  newTurnCount, 
  cardSet, 
  isGuest, 
  playerScores, 
  handleReset 
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Guest-specific state
  const [usernameOptions, setUsernameOptions] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestRank, setGuestRank] = useState(null);
  const [guestPersonalBest, setGuestPersonalBest] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Filter scores for the current card set
  const scoresForCardSet = Array.isArray(playerScores)
    ? playerScores.filter(score => score.cardSet === cardSet)
    : [];

  const turns = scoresForCardSet.map(scores => scores.turns);
  const gameCount = turns.length + 1;
  const personalBest = turns.length > 0 ? Math.min(...turns) : null;
  const avgScore = (turns.reduce((a, b) => a + b, 0) + newTurnCount) / gameCount;

  // Initialize username options for guest
  useEffect(() => {
    if (isGuest) {
      const storedUsername = getStoredGuestUsername();
      const storedBest = localStorage.getItem('guestPersonalBest');
      
      if (storedUsername) {
        setSelectedUsername(storedUsername);
        if (storedBest) {
          setGuestPersonalBest(parseInt(storedBest));
        }
      }
      
      setUsernameOptions(generateUsernameOptions());
      
      // Fetch average score
      getAverageScore().then(avg => {
        if (avg) setAverageScore(avg);
      });
    }
  }, [isGuest]);

  const handleUsernameSelect = (username) => {
    setSelectedUsername(username);
  };

  const handleGenerateNew = () => {
    setUsernameOptions(generateUsernameOptions());
  };

  const handleSubmitScore = async () => {
    if (!selectedUsername) return;
    
    setIsSubmitting(true);
    
    try {
      const { rank, isPersonalBest, bestScore } = await saveGlobalScore(
        selectedUsername, 
        newTurnCount, 
        cardSet
      );
      
      setStoredGuestUsername(selectedUsername);
      setGuestRank(rank);
      setGuestPersonalBest(bestScore);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert(t('game_over_dialogue.error_saving_score'));
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
            <h2>{t('game_over_dialogue.guest_title')}</h2>
            <div className="score-display">
              <p>{t('game_over_dialogue.your_score', { score: newTurnCount })}</p>
              {guestPersonalBest && newTurnCount < guestPersonalBest && (
                <p className="personal-best">{t('game_over_dialogue.new_personal_best')}</p>
              )}
              {guestPersonalBest && newTurnCount >= guestPersonalBest && (
                <p>{t('game_over_dialogue.personal_best_is', { best: guestPersonalBest })}</p>
              )}
              {averageScore && newTurnCount < averageScore && (
                <p className="better-than-average">
                  {t('game_over_dialogue.better_than_average', { 
                    average: averageScore.toFixed(1) 
                  })}
                </p>
              )}
            </div>

            { !selectedUsername && (


            
            <div className="username-selection">
              <h3>{t('game_over_dialogue.choose_username')}</h3>
              <div className="username-options">
                {usernameOptions.map((username, index) => (
                  <button
                    key={index}
                    className={`username-option ${selectedUsername === username ? 'selected' : ''}`}
                    onClick={() => handleUsernameSelect(username)}
                  >
                    {username}
                  </button>
                ))}
              </div>
              <button 
                className="generate-new-btn"
                onClick={handleGenerateNew}
              >
                {t('game_over_dialogue.generate_new_usernames')}
              </button>
            </div>
            ) }

            <div className="modal-buttons">
              <button 
                onClick={handleSubmitScore}
                disabled={!selectedUsername || isSubmitting}
                className="primary-btn"
              >
                {isSubmitting 
                  ? t('game_over_dialogue.submitting') 
                  : t('game_over_dialogue.submit_score')}
              </button>
              <button onClick={() => { handleReset(); onClose(); }}>
                {t('game_over_dialogue.skip')}
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
          <h2>{t('game_over_dialogue.score_submitted')}</h2>
          <div className="results-display">
            <p className="username-display">
              {t('game_over_dialogue.playing_as', { username: selectedUsername })}
            </p>
            <p className="rank-display">
              {t('game_over_dialogue.your_rank', { rank: guestRank })}
            </p>
            {newTurnCount < guestPersonalBest && (
              <p className="personal-best">
                {t('game_over_dialogue.new_personal_best_message', { score: newTurnCount })}
              </p>
            )}
            <div className="cta-message">
              <p>{t('game_over_dialogue.keep_your_spot')}</p>
              <p>{t('game_over_dialogue.play_tomorrow')}</p>
            </div>
          </div>
          
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              {t('game_over_dialogue.play_again_button')}
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="primary-btn"
            >
              {t('game_over_dialogue.sign_up')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registered player flows (unchanged)
  if (!isGuest && gameCount === 1) {
    return (
      <div className="modal">
        <div>{t('game_over_dialogue.message1', { 
          newTurnCount 
        })}
        </div>
        <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>
            {t('game_over_dialogue.play_again_button')}
          </button>
          <button onClick={() => navigate('/auth/chooseset')}>
            {t('game_over_dialogue.play_another_card_set')}
          </button>
        </div>
      </div>
    );
  } 
  
  if (!isGuest && gameCount === 2) {
    if (newTurnCount < personalBest) {
      return (
        <div className="modal">
          <div>{t('game_over_dialogue.message2a', { 
            newTurnCount 
          })}
          </div>
          <div>{t('game_over_dialogue.message2b', { 
            cardSet: t(`card_sets.${cardSet}`)   
          })}
          </div>
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              {t('game_over_dialogue.play_again_button')}
            </button>
            <button onClick={() => navigate('/auth/chooseset')}>
              {t('game_over_dialogue.play_another_card_set')}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal">
          <div>{t('game_over_dialogue.message2a', { 
            newTurnCount 
          })}
          </div>
          <div>{t('game_over_dialogue.message2c', { 
            personalBest, 
            cardSet: t(`card_sets.${cardSet}`) 
          })}
          </div>
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              {t('game_over_dialogue.play_again_button')}
            </button>
            <button onClick={() => navigate('/auth/chooseset')}>
              {t('game_over_dialogue.play_another_card_set')}
            </button>
          </div>
        </div>
      );
    }
  } 
  
  if (!isGuest && gameCount >= 3) {
    if (newTurnCount < personalBest) {
      return (
        <div className="modal">
          <div>{t('game_over_dialogue.message2a', { 
            newTurnCount })}
          </div>
          <div>{t('game_over_dialogue.message2b', { 
            cardSet: t(`card_sets.${cardSet}`)   
          })}
          </div>
          <div>{t('game_over_dialogue.message3', { 
            cardSet: t(`card_sets.${cardSet}`), 
            avgScore: avgScore.toFixed(1), 
            gameCount 
          })}
          </div>
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              {t('game_over_dialogue.play_again_button')}
            </button>
            <button onClick={() => navigate('/auth/chooseset')}>
              {t('game_over_dialogue.play_another_card_set')}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal">
          <div>{t('game_over_dialogue.message2a', { 
            newTurnCount 
          })}
          </div>
          <div>{t('game_over_dialogue.message2c', { 
            personalBest, 
            cardSet: t(`card_sets.${cardSet}`) 
          })}
          </div>
          <div>{t('game_over_dialogue.message3', { 
            cardSet: t(`card_sets.${cardSet}`), 
            avgScore: avgScore.toFixed(1), 
            gameCount 
          })}
          </div>
          <div className="modal-buttons">
            <button onClick={() => { handleReset(); onClose(); }}>
              {t('game_over_dialogue.play_again_button')}
            </button>
            <button onClick={() => navigate('/auth/chooseset')}>
              {t('game_over_dialogue.play_another_card_set')}
            </button>
          </div>
        </div>
      );
    }
  }
}

export default GameOverDialogue;