import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CreateParentPlayerProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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

  const updateParentPlayerProfile = async (playerId) => {
    try {
      await updateDoc(doc(db, 'players', playerId), {
        playerName: playerName,
        playerAvatar: playerAvatar,
        playerDOB: playerDOB,
        isParentPlayer: true,
        childPlayers: [], // Initialize as empty array
      });
      setSuccess("Your parent profile has been successfully updated! Please create profiles for your children or click 'Finish' to play a game.");
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!playerName || !playerDOB) {
      setError("Please fill in all required fields.");
      return;
    }
    updateParentPlayerProfile(currentUser.uid);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
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
