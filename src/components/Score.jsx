// Score.jsx
import React from 'react';

function Score({ matches, turns }) {
  return (
    <div className="score">
      <h3>
        Matches: <span>{matches}</span> | Turns: <span>{turns}</span>
      </h3>
    </div>
  );
}

export default Score;
