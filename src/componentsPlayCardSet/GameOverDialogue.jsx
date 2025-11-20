import "./GameOverDialogue.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function GameOverDialogue({ onClose, newTurnCount, cardSet, isGuest, playerScores, handleReset }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Filter scores for the current card set or an empty array if no scores.
 const scoresForCardSet = Array.isArray(playerScores)
  ? playerScores.filter(score => score.cardSet === cardSet)
  : [];

  // Extract turns into an array
  const turns = scoresForCardSet.map(scores => scores.turns);
  const gameCount = turns.length + 1; // Including current game
  const personalBest = turns.length > 0 ? Math.min(...turns) : null;

  const avgScore = (turns.reduce((a, b) => a + b, 0) + newTurnCount) / gameCount;

  if (isGuest) {
    return (
      <div className="modal">
        <div>
          {t('game_over_dialogue.guest_message_part1', { 
          newTurnCount 
          })}
          </div>
          <div>{t('game_over_dialogue.guest_message_part2')}</div>
        <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>{t('game_over_dialogue.play_again_button')}</button>
          <button onClick={() => navigate('/signup')}>{t('game_over_dialogue.sign_up')}</button>
        </div>
      </div>
    ); 
    
  } else if (!isGuest && gameCount === 1) {
    return (
      <div className="modal">
        <div>{t('game_over_dialogue.message1', { 
          newTurnCount 
          })}
          </div>
          <div className="modal-buttons">
          <button onClick={() => { handleReset(); onClose(); }}>{t('game_over_dialogue.play_again_button')}</button>
          <button onClick={() => navigate('/auth/chooseset')}>{t('game_over_dialogue.play_another_card_set')}</button>
          </div>
      </div>
    );

  } else if (!isGuest && gameCount === 2) {
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
          <button onClick={() => { handleReset(); onClose(); }}>{t('game_over_dialogue.play_again_button')}</button>
          <button onClick={() => navigate('/auth/chooseset')}>{t('game_over_dialogue.play_another_card_set')}</button>
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
          <button onClick={() => { handleReset(); onClose(); }}>{t('game_over_dialogue.play_again_button')}</button>
          <button onClick={() => navigate('/auth/chooseset')}>{t('game_over_dialogue.play_another_card_set')}</button>
          </div>
        </div>
      );
    }
  } else if (!isguest && gameCount >= 3) {
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
          <button onClick={() => { handleReset(); onClose(); }}>{t('game_over_dialogue.play_again_button')}</button>
          <button onClick={() => navigate('/auth/chooseset')}>{t('game_over_dialogue.play_another_card_set')}</button>
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
          <button onClick={() => { handleReset(); onClose(); }}>{t('game_over_dialogue.play_again_button')}</button>
          <button onClick={() => navigate('/auth/chooseset')}>{t('game_over_dialogue.play_another_card_set')}</button>
          </div>
        </div>
      );
    }
  }
}

export default GameOverDialogue;

