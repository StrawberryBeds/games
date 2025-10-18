import { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/authContext";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function CreateParentPlayerProfile({ avatars, onComplete }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    playerName: "",
    playerAvatar: "",
    playerDOB: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAvatarSelect = (avatarId) => {
    setFormData({ ...formData, playerAvatar: avatarId });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validate all fields
    if (Object.values(formData).some((field) => !field)) {
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
        setupComplete: false, // Add this flag
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
      <h3>Parent Profile</h3>
      {/* Given Name Field */}
      {formData.givenName !== undefined && (
        <div className="form-group">
          <label htmlFor="givenName">Given Name</label>
          <input
            type="text"
            id="givenName"
            name="givenName"
            value={formData.givenName}
            onChange={handleChange}
            required
          />
        </div>
      )}
      {/* Family Name Field */}
      {formData.familyName !== undefined && (
        <div className="form-group">
          <label htmlFor="familyName">Family Name</label>
          <input
            type="text"
            id="familyName"
            name="familyName"
            value={formData.familyName}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {/* Player DOB Field */}
      {formData.playerDOB !== undefined && (
        <div className="form-group">
           <label htmlFor="playerDOB">Player Date of Birth</label>
          <input
            type="date"
            id="playerDOB"
            name="playerDOB"
            value={formData.playerDOB}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {/* Player Name Field */}
      {formData.playerName !== undefined && (
        <div className="form-group">
          <label htmlFor="playerName">Player Name</label>
          <input
            type="text"
            id="playerName"
            name="playerName"
            value={formData.playerName}
            onChange={handleChange}
            required
          />
        </div>
      )}
    

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
        </div>

      {/* Family ID Field (hidden if not needed) */}
      {formData.familyId !== undefined && (
        <div className="form-group">
          <label htmlFor="familyId">Family Id</label>
          <input
            type="text"
            id="familyId"
            name="familyId"
            value={formData.familyId}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {/* Is Parent Player Field (hidden if not needed) */}
      {formData.isParentPlayer !== undefined && (
        <div className="form-group">
          <label htmlFor="isParentPlayer">Is Parent Player</label>
          <select
            id="isParentPlayer"
            name="isParentPlayer"
            value={formData.isParentPlayer}
            onChange={handleChange}
            required
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Create Parent Profile
      </button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </form>
  );
}

export default CreateParentPlayerProfile;
