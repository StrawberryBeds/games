// componentsPlayCardSet/Score.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function Score({ matches, turns }) {
  const { t } = useTranslation();
  return (
    <div className="score">
      <h3>
        {t('score.matches')} <span>{matches}</span> | {t('score.turns')} <span>{turns}</span>
      </h3>
    </div>
  );
}

export default Score;
