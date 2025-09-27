import React, { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';

function CreateChildPlayerProfile({ profileId }) {
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

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  if (Object.values(formData).some(field => !field)) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    const parentDoc = await getDoc(doc(db, 'players', currentUser.uid));
    if (!parentDoc.exists()) {
      throw new Error("Parent profile not found");
    }
    const parentData = parentDoc.data();

    // 1. Create the child profile (without playerId initially)
    const childRef = await addDoc(collection(db, 'players'), {
      ...formData,
      isParentPlayer: false,
      familyId: parentData.familyId,
      parentPlayerId: currentUser.uid,
      createdAt: new Date().toISOString()
      // No playerId here yet!
    });

    // 2. Update the newly created document with its own ID
    await updateDoc(childRef, {
      playerId: childRef.id  // Now we have the ID!
    });

    // 3. Update parent's childPlayers array
    await updateDoc(doc(db, 'players', currentUser.uid), {
      childPlayers: arrayUnion(childRef.id)
    });

    setSuccess("Child profile created successfully!");
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
      <h4>Child Profile {profileId}</h4>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {Object.entries(formData).map(([field, value]) => (
        <div key={field} className="form-group">
          <label htmlFor={`${field}-${profileId}`}>
            {field.split(/(?=[A-Z])/).map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </label>
          <input
            type={field.includes('DOB') ? 'date' : 'text'}
            id={`${field}-${profileId}`}
            name={field}
            value={value}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <button type="submit" className="submit-button">
        Create Child Profile
      </button>
    </form>
  );
}

export default CreateChildPlayerProfile;
