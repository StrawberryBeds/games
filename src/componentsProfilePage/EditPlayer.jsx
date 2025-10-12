import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuth } from "../context/authContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import avatars from '../data/playerAvatars';

function EditPlayer({ player, avatars, onComplete }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    playerName: "",
    playerAvatar: "",
    playerDOB: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Populate form data when the player prop changes
  useEffect(() => {
    if (player) {
      setFormData({
        givenName: player.givenName || "",
        familyName: player.familyName || "",
        playerName: player.playerName || "",
        playerAvatar: player.playerAvatar || "",
        playerDOB: player.playerDOB || "",
      });
    }
  }, [player]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarName) => {
    setFormData({ ...formData, playerAvatar: avatarName });
  };

  const handlePlayerSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!player?.id) {
      setError("No player selected.");
      return;
    }

    try {
      const playerRef = doc(db, "players", player.id);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        throw new Error("Player profile not found.");
      }

      await updateDoc(playerRef, {
        ...formData,
      });

      setSuccess(`${player.playerName}'s profile updated successfully!`);
      if (onComplete) onComplete(true);
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className='player-data'>
      <form onSubmit={handlePlayerSubmit} className="parent-profile-form">
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Given Name Field */}
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

        {/* Family Name Field */}
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

        {/* Player DOB Field */}
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

        {/* Player Name Field */}
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

        {/* Player Avatar Field */}
          <div className="form-group">
            <label>Select Avatar</label>
            <div className="avatar-grid">
              {avatars &&
                Object.values(avatars).map((avatar) => (
                  <div
                    key={avatar.name}
                    className={`avatar-option ${formData.playerAvatar === avatar.name ? "selected" : ""
                      }`}
                    onClick={() => handleAvatarSelect(avatar.name)}
                  >
                    <img src={avatar.image} alt={avatar.name} />
                    <span>{avatar.name}</span>
                  </div>
                ))}
            </div>
          </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          disabled={!player}
        >
          Update {player?.playerName || 'Profile'}
        </button>
      </form>
    </div>
  );
}

export default EditPlayer;
