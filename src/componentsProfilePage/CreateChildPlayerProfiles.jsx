import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import { getDoc, addDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CreateChildPlayerProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');
  const [playerDOB, setPlayerDOB] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

const createChildPlayerProfile = async () => {
    try {
      // Fetch the parent's player profile to get the familyId
      const parentPlayerRef = doc(db, 'players', currentUser.uid);
      const parentPlayerSnap = await getDoc(parentPlayerRef);

      if (!parentPlayerSnap.exists()) {
        throw new Error("Parent player profile not found!");
      }

      const parentPlayerData = parentPlayerSnap.data();
      const familyId = parentPlayerData.familyId; // Extract familyId

      // Create the child player profile with the same familyId
      const childRef = await addDoc(collection(db, 'players'), {
        playerName: playerName,
        playerAvatar: playerAvatar,
        playerDOB: playerDOB,
        isParentPlayer: false,
        familyId: familyId, // Use the fetched familyId
        parentPlayerId: currentUser.uid,
        createdAt: new Date().toISOString()
      });

      // Update parent profile with new child's playerId
      await updateParentPlayerProfile(currentUser.uid, childRef.id);
      setSuccess("Your child's profile has been successfully created. Please create another or click 'Finish' to play a game.");
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
};


  const updateParentPlayerProfile = async (parentId, childId) => {
    try {
      await updateDoc(doc(db, 'players', parentId), {
        childPlayers: arrayUnion(childId) // Append childId to array
      });
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!playerName || !playerAvatar || !playerDOB) {
      setError("Please fill in all required fields.");
      return;
    }
    createChildPlayerProfile();
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

export default CreateChildPlayerProfile;
