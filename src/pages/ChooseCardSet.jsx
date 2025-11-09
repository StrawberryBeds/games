// src/pages/Home.jsx
import CardSetSelection from '../componentsPlayCardSet/CardSetSelection';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';


function Home() {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  return (
    <>
     <CardSetSelection></CardSetSelection>
    </>
  );
}

export default Home;
