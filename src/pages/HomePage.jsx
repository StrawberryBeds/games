// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import NewsList from './NewsList';
import GameBoard from '../componentsPlayCardSet/GameBoard';

// import PlayCardSet from './PlayCardSet';


function Home() {

  const navigate = useNavigate();

  return (
    <>
        <NewsList></NewsList>
        <GameBoard></GameBoard>
    </>
  );
}

export default Home;
