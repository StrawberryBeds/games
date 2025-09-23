import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

// import { usePlayerSelection } from '../context/playerContext';
import { query, where, getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';



function ProfilePage() {
    const { currentUser } = useAuth();
    // const { setCurrentPlayer, setRequiresParentAuth } = usePlayerSelection();
    const navigate = useNavigate();
    const [familyPlayers, setFamilyPlayers] = useState([]); // State to store fetched players
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
  
    // Redirect if not logged in
    useEffect(() => {
      if (!currentUser) {
        navigate('/signin');
      }
    }, [currentUser, navigate]);
  
    // Fetch family players when the component mounts
    useEffect(() => {
      const fetchFamilyPlayers = async () => {
        if (!currentUser) return; // Exit if no user
  
        try {
          setLoading(true);
          // 1. Fetch the parent's player profile to get the familyId
          const parentPlayerRef = doc(db, 'players', currentUser.uid);
          const parentPlayerSnap = await getDoc(parentPlayerRef);
  
          if (!parentPlayerSnap.exists()) {
            throw new Error("Parent player profile not found!");
          }
  
          const parentPlayerData = parentPlayerSnap.data();
          const familyId = parentPlayerData.familyId;
  
          // 2. Fetch all players in the family
          const playersQuery = query(
            collection(db, 'players'),
            where('familyId', '==', familyId)
          );
          const querySnapshot = await getDocs(playersQuery);
          const players = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
  
          // 3. Update state with the fetched players
          setFamilyPlayers(players);
        } catch (err) {
          console.error("Error fetching family players:", err);
          setError("Failed to load family players. Please try again.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchFamilyPlayers();
    }, [currentUser]);
  
    // TO DO : Revise this so remove select player without requiresParentAuth
    // const handlePlayerSelect = (player) => {
    //   setCurrentPlayer(player);
    //   if (player.isParent) {
    //     setRequiresParentAuth(true); // Trigger password prompt
    //     navigate('/');
    //   } else {
    //     navigate('/'); // Redirect to home for children
    //   }
    // };
  
    // Show loading or error states
    if (loading) {
      return <div className="player-selector">Loading players...</div>;
    }
  
    if (error) {
      return <div className="player-selector">{error}</div>;
    }
  
    // Render player tiles
    return (
      <div className="player-selector">
        <h2>Your Family Profiles</h2>
        <div className="player-tiles">
          {familyPlayers.map((player) => (
            <button
              key={player.id}
            //   onClick={() => handlePlayerSelect(player)}
              className="player-tile"
            >
              {player.playerName}
              {player.playerAvatar}
              {player.playerDOB}
            </button>
          ))}
        </div>
      </div>
    );
  }

export default ProfilePage;
