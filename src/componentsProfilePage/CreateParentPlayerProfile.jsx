import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/authContext";
import { v4 as uuidv4 } from "uuid";

function CreateParentPlayerProfile({ avatars, onComplete }) {
  const { t } = useTranslation();
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

  const checkPlayerNameIsUnique = async (playerName) => {
    if (!playerName) return false;
    const playersRef = collection(db, "players");
    const q = query(playersRef, where("playerName", "==", playerName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // true if unique, false if exists
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (Object.values(formData).some((field) => !field)) {
      setError(t('signUp.error_all_fields'));
      return;
    }

    try {
      const isUnique = await checkPlayerNameIsUnique(formData.playerName);
      if (!isUnique) {
        setError(t('createProfile.unique_player'));
        return;
      }
    } catch (error) {
      setError(t('createProfile.error_checking'));
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
        setupComplete: false,
      });
       setSuccess(t('createProfile.success_parent_created'));
      if (onComplete) onComplete(true);
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="parent-profile-form">
      <h3>{t('createProfile.parent_profile')}</h3>
      {/* Given Name Field */}
      {formData.givenName !== undefined && (
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
      )}
      {/* Family Name Field */}
      {formData.familyName !== undefined && (
        <div className="form-group">
          <label htmlFor="familyName">{t('createProfile.family_name')}</label>
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
          <label htmlFor="playerDOB">{t('createProfile.parent_dob')}</label>
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
          <label htmlFor="playerName">{t('createProfile.player_name')}</label>
          <input
            type="text"
            id="playerName"
            name="playerName"
            value={formData.playerName}
            onChange={handleChange}
            onBlur={async () => {
              const isUnique = await checkPlayerNameIsUnique(formData.playerName);
              if (!isUnique) setError(t('createProfile.unique_player'));
            }}
            required
          />
        </div>
      )}
      {/* Avatar Selection */}
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
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="submit-button">
        {t('createProfile.create_parent_button')}
      </button>
    </form>
  );
}

export default CreateParentPlayerProfile;
