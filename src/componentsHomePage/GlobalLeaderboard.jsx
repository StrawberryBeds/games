import { useTranslation } from 'react-i18next';
import './GlobalLeaderboard.css';

function GlobalLeaderboard() {
  const { t } = useTranslation();

  return (
    <div className="global-leaderboard">
      <h2>{t('global_leaderboard.title')}</h2>
      <p>{t('global_leaderboard.no_scores')}</p>
      <p className="leaderboard-cta">Play a round to see your score for this visit.</p>
    </div>
  );
}

export default GlobalLeaderboard;