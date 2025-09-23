import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore'; // Use setDoc instead of addDoc
 import { v4 as uuidv4 } from 'uuid';

function CreateParentPlayerProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');
  const [playerDOB, setPlayerDOB] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!givenName || !familyName || !playerName || !playerAvatar || !playerDOB) {
            setError("Please fill in all required fields.");
            return;
        }
        try {
          // 2. Create user profile in Firestore 
          await setDoc(doc(db, 'users', currentUser.uid), {
            userId: currentUser.uid,
            givenName: givenName,
            familyName: familyName,
            // userEmail: currentUser.userEmail,
            createdAt: new Date().toISOString()
            });

              const familyId = uuidv4();

             await setDoc(doc(db, 'players', currentUser.uid), {
                playerId: currentUser.uid,
                familyId: familyId,
                isParent: true,
                givenName: givenName,
                familyName: familyName,
                // userEmail: currentUser.userEmail,
                playerName: playerName,
                playerAvatar: playerAvatar,
                playerDOB: playerDOB,
                isParentPlayer: true,
                childPlayers: [],
                createdAt: new Date().toISOString()
            });
      setSuccess("Your parent user and player profiles have been successfully created! Please create profiles for your children or click 'Finish' to play a game.");
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div>
                <label>Given Name</label>
                <input type="text" value={givenName} onChange={(e) => setGivenName(e.target.value)} name="givenName" />
            </div>
            <div>
                <label>Family Name</label>
                <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} name="familyName" />
            </div>



      <div>
        <label>Player Name</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          name="playerName"
        />
      </div>
      <div>
        <label>Player Avatar</label>
        <input
          type="text"
          value={playerAvatar}
          onChange={(e) => setPlayerAvatar(e.target.value)}
          name="playerAvatar"
        />
      </div>
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          value={playerDOB}
          onChange={(e) => setPlayerDOB(e.target.value)}
          name="playerDOB"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateParentPlayerProfile;
