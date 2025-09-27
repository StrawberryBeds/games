import React, { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/authContext";
import { doc, setDoc } from "firebase/firestore"; // Use setDoc instead of addDoc
import { v4 as uuidv4 } from "uuid";


function CreateParentPlayerProfile( { onComplete}) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    playerName: "",
    playerAvatar: "",
    playerDOB: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validate all fields
    if (Object.values(formData).some(field => !field)) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const familyId = uuidv4();
      await setDoc(doc(db, "players", currentUser.uid), {
        playerId: currentUser.uid,
        familyId: familyId,
        isParent: true,
        isParentPlayer: true,
                ...formData,
        childPlayers: [],
        createdAt: new Date().toISOString(),
        setupComplete: false // Add this flag
      });
      setSuccess("Parent profile created successfully!");
      if (onComplete) onComplete(true);
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

    return (
    <form onSubmit={handleSubmit} className="parent-profile-form">
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {Object.entries(formData).map(([field, value]) => (
        <div key={field} className="form-group">
          <label htmlFor={field}>
            {field.split(/(?=[A-Z])/).map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </label>
          <input
            type={field.includes('DOB') ? 'date' : 'text'}
            id={field}
            name={field}
            value={value}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <button type="submit" className="submit-button">
        Create Parent Profile
      </button>
    </form>
  );
}

export default CreateParentPlayerProfile;