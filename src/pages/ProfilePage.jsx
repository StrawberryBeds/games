import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuth } from '../context/authContext';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('')
  const [playerDOB, setPlayerDOB] = useState('')
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  const handleCreateUserProfile = async () => {
    try {
      await addDoc(collection(db, 'users'), {
        playerName: playerName,
        playerAvatar: playerAvatar,
        playerDOB: playerDOB,
        userId: currentUser.uid,
      });
      setSuccess("Profile created successfully!");
      setError('');
      navigate('/');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!playerName) {
      setError("Please fill in all required fields.");
      return;
    }
    handleCreateUserProfile();
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
        <label> Date of Birth</label>
        <input
          type="text"
          value={playerDOB}
          onChange={(e) => setPlayerDOB(e.target.value)}
          name="playerDOB"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ProfilePage;
