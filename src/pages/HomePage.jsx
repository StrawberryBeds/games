import { useNavigate } from 'react-router-dom';
// import HomeSummary from '../componentsHomePage/HomeSummary.jsx';
import GameBoard from '../componentsPlayCardSet/GameBoard';
import cardSets from "../data/cardSets";
import './HomePage.css';

function Home() {
  const navigate = useNavigate();

  const handlePlayMatch = () => {
    navigate('/cardset/0');
  };

  const handlePlaySlide = () => {
    navigate('/slide/0');
  };

  return (
    <>
      <div className='home-container'>
        <div className="column">
          <GameBoard
            cards={cardSets[2].Cards}
            cardSetName={cardSets[2].nameKey}
            isGuest={true}
          />
        </div>
        {/* <div className="column">
          <HomeSummary></HomeSummary>
        </div> */}
      </div>
    </>
  );
}

export default Home;