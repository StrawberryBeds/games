// src/componentsProfilePage/CreateChildPlayerProfiles.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import avatars from '../data/playerAvatars';

function CreateChildPlayerProfile({ profileId, avatars }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    playerName: '',
    playerAvatar: '',
    playerDOB: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkPlayerNameIsUnique = async (playerName) => {
    if (!playerName) return false;
    const playersRef = collection(db, "players");
    const q = query(playersRef, where("playerName", "==", playerName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // true if unique, false if exists
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData(prev => ({ ...prev, playerAvatar: avatarId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields are filled
    if (!formData.playerName || !formData.playerAvatar || !formData.playerDOB) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const isUnique = await checkPlayerNameIsUnique(formData.playerName);
      if (!isUnique) {
        setError("Player name must be unique.");
        return;
      }
    } catch (error) {
      setError("Error checking player name. Please try again.");
      return;
    }

    try {
      // 1. Get parent document
      const parentDoc = await getDoc(doc(db, 'players', currentUser.uid));
      if (!parentDoc.exists()) {
        throw new Error("Parent profile not found");
      }
      const parentData = parentDoc.data();

      // 2. Create the child profile
      const childRef = await addDoc(collection(db, 'players'), {
        ...formData,
        isParentPlayer: false,
        familyId: parentData.familyId,
        parentPlayerId: currentUser.uid,
        createdAt: new Date().toISOString()
      });

      // 3. Update the child document with its own ID
      await updateDoc(childRef, {
        playerId: childRef.id
      });

      // 4. Update parent's childPlayers array
      await updateDoc(doc(db, 'players', currentUser.uid), {
        childPlayers: arrayUnion(childRef.id)
      });

      setSuccess("Child profile created successfully!");
      // Reset form but keep profileId
      setFormData({
        playerName: '',
        playerAvatar: '',
        playerDOB: ''
      });
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="child-profile-form">
      <h3>Child Profile</h3>


      {/* Player Name Field */}
      <div className="form-group">
        <label htmlFor={`playerName-${profileId}`}>Child's Player Name</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          value={formData.playerName}
          onChange={handleChange}
          onBlur={async () => {
            const isUnique = await checkPlayerNameIsUnique(formData.playerName);
            if (!isUnique) setError("Player name must be unique.");
          }}
          required
        />
      </div>

      {/* Date of Birth Field */}
      <div className="form-group">
        <label htmlFor={`playerDOB-${profileId}`}>Child's Date of Birth</label>
        <input
          type="date"
          id={`playerDOB-${profileId}`}
          name="playerDOB"
          value={formData.playerDOB}
          onChange={handleChange}
          required
        />
      </div>

      {/* Avatar Selection */}
      <div className="form-group">
        <label>Select Avatar</label>
        <div className="avatar-grid">
          {avatars &&
            Object.values(avatars).map((avatar) => (
              <div
                key={avatar.id}
                className={`avatar-option ${formData.playerAvatar === avatar.id ? "selected" : ""
                  }`}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                <img src={avatar.image} alt={avatar.name} />
                <span>{avatar.name}</span>
              </div>
            ))}
        </div>

        {/* Hidden input to store selected avatar ID in form data */}
        <input
          type="hidden"
          name="playerAvatar"
          value={formData.playerAvatar}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="submit-button">
        Create Child Profile
      </button>
    </form>
  );
}

export default CreateChildPlayerProfile;

