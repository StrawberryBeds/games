// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import NewsList from './NewsList';
import GameBoard from '../componentsPlayCardSet/GameBoard';
import cardSets from "../data/cardSets";
import './HomePage.css';


function Home() {

  const navigate = useNavigate();

  return (
    <>
    <div className='home-container'>
              <div class="column">
                <GameBoard
        cards={cardSets[0].Cards}
        cardSetName={cardSets[0].name}
        isGuest={true}
      />
      </div>
              <div class="column">
      <NewsList></NewsList>
      </div>
      </div>
    </>
  );
}

export default Home;

