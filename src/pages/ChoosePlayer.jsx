import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ChoosePlayer() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]); // State for family players

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Fetch family players when the component mounts
  useEffect(() => {
    const fetchFamilyPlayers = async () => {
      try {
        // 1. Fetch the parent's player profile to get the familyId
        const parentPlayerRef = doc(db, 'players', currentUser.uid);
        const parentPlayerSnap = await getDoc(parentPlayerRef);

        if (!parentPlayerSnap.exists()) {
          throw new Error("Parent player profile not found!");
        }

        const parentPlayerData = parentPlayerSnap.data();
        const familyId = parentPlayerData.familyId;

        // 2. Fetch all players in the family
        const q = query(collection(db, 'players'), where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);
        const players = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Update state with the fetched players
        setFamilyPlayers(players);
      } catch (error) {
        console.error("Error fetching family players:", error);
      }
    };

    fetchFamilyPlayers();
  }, [currentUser]);

  return (
    <div>
      <h1>Who's playing?</h1>
      <ul>
        {familyPlayers.map(player => (
          <li key={player.id}>
            <button onClick={() => navigate('/')}>{player.playerName}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChoosePlayer;


<button onClick={() => navigate('/signin')}>Sign In</button>