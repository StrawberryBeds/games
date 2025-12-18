// src/componentsHomePage/GlobalLeaderboard.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getGlobalLeaderboard } from '../utils/globalLeaderboardHelpers';
import { getStoredGuestUsername } from '../utils/usernameGenerator';
import './GlobalLeaderboard.css';

function GlobalLeaderboard() {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestUsername, setGuestUsername] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getGlobalLeaderboard(20);
        setLeaderboard(data);
        
        const storedUsername = getStoredGuestUsername();
        if (storedUsername) {
          setGuestUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="global-leaderboard">
        <h2>{t('global_leaderboard.title')}</h2>
        <p>{t('global_leaderboard.loading')}</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="global-leaderboard">
        <h2>{t('global_leaderboard.title')}</h2>
        <p>{t('global_leaderboard.no_scores')}</p>
        <p className="leaderboard-cta">{t('global_leaderboard.be_first')}</p>
      </div>
    );
  }

  // Find guest player's info if they're on the leaderboard
  const guestPlayerInfo = guestUsername ? (() => {
    for (const entry of leaderboard) {
      const player = entry.players.find(p => p.username === guestUsername);
      if (player) {
        return {
          rank: entry.rank,
          score: entry.score,
          lastPlayed: player.lastPlayed
        };
      }
    }
    return null;
  })() : null;

  return (
    <div className="global-leaderboard">
      <h2>{t('global_leaderboard.title')}</h2>
      <p className="leaderboard-subtitle">{t('global_leaderboard.subtitle')}</p>
      
      {guestPlayerInfo && (
        <div className="guest-player-info">
          <p className="your-rank">
            {t('global_leaderboard.your_position', { 
              username: guestUsername,
              rank: guestPlayerInfo.rank,
              score: guestPlayerInfo.score
            })}
          </p>
          <p className="keep-playing">
            {t('global_leaderboard.keep_playing')}
          </p>
        </div>
      )}

      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span className="rank-col">{t('global_leaderboard.rank')}</span>
          <span className="username-col">{t('global_leaderboard.player')}</span>
          <span className="score-col">{t('global_leaderboard.score')}</span>
        </div>
        
        {leaderboard.map((entry) => (
          <div key={`${entry.rank}-${entry.score}`} className="leaderboard-group">
            {entry.players.map((player, index) => {
              const isGuestPlayer = player.username === guestUsername;
              return (
                <div 
                  key={player.username}
                  className={`leaderboard-row ${isGuestPlayer ? 'highlight' : ''}`}
                >
                  <span className="rank-col">
                    {index === 0 ? `#${entry.rank}` : ''}
                  </span>
                  <span className="username-col">
                    {player.username}
                    {isGuestPlayer && (
                      <span className="you-badge">{t('global_leaderboard.you')}</span>
                    )}
                  </span>
                  <span className="score-col">{player.score}</span>
                </div>
              );
            })}
            {entry.tiedCount > 1 && (
              <div className="tie-info">
                {t('global_leaderboard.tied_players', { count: entry.tiedCount })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="leaderboard-footer">
        <p>{t('global_leaderboard.monthly_reset')}</p>
        <p className="signup-cta">
          {t('global_leaderboard.signup_message')}
        </p>
      </div>
    </div>
  );
}

export default GlobalLeaderboard;