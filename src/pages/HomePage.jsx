// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import HomeSummary from '../componentsHomePage/HomeSummary.jsx';
import GameBoard from '../componentsPlayCardSet/GameBoard';
import cardSets from "../data/cardSets";
import './HomePage.css';

function Home() {
  const navigate = useNavigate();

  const handlePlayMatch = () => {
    navigate('/auth/chooseset');
  };

  const handlePlaySlide = () => {
    navigate('/auth/slide/0');
  };

  return (
    <>
      <div className='home-container'>
        <div className="column">
          <div className="game-selection-buttons">
            <button 
              className="game-button play-match-btn"
              onClick={handlePlayMatch}
            >
              Play Match
            </button>
            <button 
              className="game-button play-slide-btn"
              onClick={handlePlaySlide}
            >
              Play Slide
            </button>
          </div>
          <GameBoard
            cards={cardSets[2].Cards}
            cardSetName={cardSets[2].nameKey}  // Changed from .name to .nameKey
            isGuest={true}
          />
        </div>
        <div className="column">
          <HomeSummary></HomeSummary>
        </div>
      </div>
    </>
  );
}

export default Home;