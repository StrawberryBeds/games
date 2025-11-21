import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase";
import { useAuth } from "../context/authContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import avatars from '../data/playerAvatars';

function EditPlayer({ player, onComplete }) {
  const { t } = useTranslation();
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
      setError(t("no_player_selected"));
      return;
    }
    try {
      const playerRef = doc(db, "players", player.id);
      const playerSnap = await getDoc(playerRef);
      if (!playerSnap.exists()) {
        throw new Error(t("player_profile_not_found"));
      }
      await updateDoc(playerRef, {
        ...formData,
      });
      setSuccess(t("editPlayer.profile_updated_successfully", { player: { playerName: player.playerName } }));
      if (onComplete) onComplete(true);
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className='player-data'>
      <form onSubmit={handlePlayerSubmit} className="parent-profile-form">
        {/* Given Name Field */}
        {player.isParentPlayer ? (
          <div className="form-group">
            <label htmlFor="givenName">{t('createProfile.given_name')}</label>
            <input
              type="text"
              id="givenName"
              name="givenName"
              value={formData.givenName}
              onChange={handleChange}
              required
            />
          </div>
        ) : null}

        {/* Family Name Field */}
        {player.isParentPlayer ? (
        <div className="form-group">
          <label htmlFor="familyName">{t('createProfile.family_name')}</label>
          <input
            type="text"
            id="familyName"
            name="familyName"
            value={formData.familyName}
            onChange={handleChange}
            hidden={!player.isParentPlayer}
            required={player.isParentPlayer}
          />
        </div>
        ) : null}
        {/* Player DOB Field */}
        <div className="form-group">
          <label htmlFor="playerDOB">{t('editPlayer.player_dob')}</label>
          <input
            type="date"
            id="playerDOB"
            name="playerDOB"
            value={formData.playerDOB}
            onChange={handleChange}
            required
            readOnly
          />
          <p className="form-text text-muted">
            {t('editPlayer.read_only')}
          </p>
        </div>
        {/* Player Name Field */}
        <div className="form-group">
          <label htmlFor="playerName">{t('editPlayer.player_name')}</label>
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
          <label>{t('createProfile.avatar')}</label>
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
        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          disabled={!player}
        >
          {t('editPlayer.update_profile')}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form >
    </div >
  );
}

export default EditPlayer;
