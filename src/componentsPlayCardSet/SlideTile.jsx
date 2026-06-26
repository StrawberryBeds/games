import React from 'react';
import './SlideTile.css';
import { getTileBackgroundPosition, TILE_BACKGROUND_SIZE } from '../utils/slideGameUtils';

function SlideTile({ tileId, isEmpty, tileImage, isAdjacent, isClickable, onClick }) {
  const backgroundPos = getTileBackgroundPosition(tileId);

  if (isEmpty) {
    return <div className="slide-tile empty-tile" />;
  }

  return (
    <div
      className={`slide-tile ${isClickable && isAdjacent ? 'clickable' : ''} ${
        isClickable && !isAdjacent ? 'disabled' : ''
      }`}
      style={{
        backgroundImage: `url(${tileImage})`,
        backgroundSize: TILE_BACKGROUND_SIZE,
        backgroundPosition: `${backgroundPos.backgroundPositionX} ${backgroundPos.backgroundPositionY}`,
        backgroundRepeat: 'no-repeat',
      }}
      onClick={onClick}
    />
  );
}

export default SlideTile;
