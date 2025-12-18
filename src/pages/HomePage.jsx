// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import HomeSummary from '../componentsHomePage/HomeSummary.jsx';
import GameBoard from '../componentsPlayCardSet/GameBoard';
import cardSets from "../data/cardSets";
import './HomePage.css';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className='home-container'>
        <div className="column">
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