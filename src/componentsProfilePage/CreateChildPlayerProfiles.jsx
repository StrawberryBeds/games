// src/componentsProfilePage/CreateChildPlayerProfiles.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/authContext';

function CreateChildPlayerProfile({ profileId, avatars }) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    playerName: '',
    playerAvatar: '',
    playerDOB: '',
    parentalConsent: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value // ✅ Correct for checkboxes
  }));
};


  const checkPlayerNameIsUnique = async (playerName) => {
    if (!playerName) return false;
    const playersRef = collection(db, "players");
    const q = query(playersRef, where("playerName", "==", playerName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData(prev => ({ ...prev, playerAvatar: avatarId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.playerName || !formData.playerAvatar || !formData.playerDOB || !formData.parentalConsent) {
      setError(t('signUp.error_all_fields'));
      setError(t('createProfile.error_consent_required'))
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
      const parentDoc = await getDoc(doc(db, 'players', currentUser.uid));
      if (!parentDoc.exists()) {
        throw new Error(t('createProfile.error_parent_not_found'));
      }
      const parentData = parentDoc.data();
      const childRef = await addDoc(collection(db, 'players'), {
        ...formData,
        isParentPlayer: false,
        familyId: parentData.familyId,
        parentPlayerId: currentUser.uid,
        parentalConsent: true,
        createdAt: new Date().toISOString()

      });
      await updateDoc(childRef, {
        playerId: childRef.id
      });
      await updateDoc(doc(db, 'players', currentUser.uid), {
        childPlayers: arrayUnion(childRef.id)
      });
      setSuccess(t('createProfile.success_child_created'));
      setFormData({
        playerName: '',
        playerAvatar: '',
        playerDOB: '',
        parentalConsent: false
      });
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="child-profile-form">
      <h3>{t('createProfile.child_profile')}</h3>
      {/* Player Name Field */}
      <div className="form-group">
        <label htmlFor={`playerName-${profileId}`}>{t('createProfile.child_player_name')}</label>
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
      {/* Date of Birth Field */}
      <div className="form-group">
        <label htmlFor={`playerDOB-${profileId}`}>{t('createProfile.child_dob')}</label>
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
        <input
          type="hidden"
          name="playerAvatar"
          value={formData.playerAvatar}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.parentalConsent}
            name="parentalConsent"
            onChange={handleChange}
            required
          />
          {t('createProfile.parentalConsent')}
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="submit-button">
        {t('createProfile.create_child_button')}
      </button>
    </form>
  );
}

export default CreateChildPlayerProfile;
