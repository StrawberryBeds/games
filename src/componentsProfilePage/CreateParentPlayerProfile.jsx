import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useAuth } from "../context/authContext";
import { doc, setDoc } from "firebase/firestore"; // Use setDoc instead of addDoc
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
      alert(
        "I consent to the information I have given being used to create (1) a userId, (2) a familyId and (3) a playerId. I understand that: (1) the userId will be used to process payment information and to create my playerId, a familyId and playerIds for any child playerIds I choose to create; (2) the familyId will be used to associate me with my children as child players and associate them with me as a parent player; and (3) my playerId will be used to identify me as a player, the parentPlayer within a familyId, as the parent of the specific children I identify as childPlayers; and (4) that this playerId is used to record the results of my games (as an indivudal player) and place me in leaderboards; that it lets me create and modify child players, identifies me as responsible for (the parent of) child players, and gives me access to read and/modify the child players I have created; that the user account and parentProfile let me connect with other users (players identified as parentPlayers by giving credit card information) to expand my family network through the familyId. I understand that the data I provide is stored around the world on the servers of Firebase, a subsidiary of Alphabet, better known as Google, and that the date I provide is legally accessible to the employees of this site, Alphabet, and the legally appointed agents of Quebec, Canada, and the USA. The owner of this site is Samuel Wood. The owner of this site is located in Quebec, Canada, and is subject to the laws of Quebec, Canada, and the territories he (the owner) operates in. Alphabet is located in California, USA, and is subject to the laws of California, the USA, and the territories it (Alphabet) operates in. The Data Protection Officer for this site, globally and for the puposes of Quebec's Loi 25 and the European Union's GDPR, is Samuel Wood. He can be contacted for disclosure and deletion of personal data at samuel.l.wood@gmail.com. In case of dispute, this agreement is subject to the laws of Quebec, Canada."
      );
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="parent-profile-form">
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

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
          <label htmlFor="playerDOB">Player Dob</label>
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

      {/* Player Avatar Field */}
      <div className="form-group">
        <label>Select Avatar</label>
        <div className="avatar-grid">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`avatar-option ${
                formData.playerAvatar === avatar.id ? "selected" : ""
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
    </form>
  );
}

export default CreateParentPlayerProfile;
